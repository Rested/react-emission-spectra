import json

import requests
from pyquery import PyQuery as pq
import mendeleev


def main():
    element_wavelengths = {}
    for element in mendeleev.get_all_elements():
        el: mendeleev.Element = element
        print(el.symbol)
        resp = requests.get(
            f"https://physics.nist.gov/cgi-bin/ASD/lines1.pl?spectra={el.symbol}+I&limits_type=0&low_w=&upp_w=&unit=1&submit=Retrieve+Data&de=0&format=0&line_out=0&en_unit=0&output=0&bibrefs=1&page_size=15&show_obs_wl=1&show_calc_wl=1&unc_out=1&order_out=0&max_low_enrg=&show_av=2&max_upp_enrg=&tsb_value=0&min_str=&A_out=0&intens_out=on&max_str=&allowed_out=1&forbid_out=1&min_accur=&min_intens=&conf_out=on&term_out=on&enrg_out=on&J_out=on")
        tree = pq(resp.text)

        element_wavelengths[el.symbol] = {
            "observed": [],
            "ritz": [],
        }

        tables = tree("table")
        for table in tables:
            rows = pq(table)("tbody tr")
            observed_idx = None
            ritz_idx = None
            for i, v in enumerate(pq(rows)("th")):
                txt = pq(v).text().casefold().strip()
                if "wavelength" not in txt:
                    continue
                if ritz_idx is None and "ritz" in txt:
                    ritz_idx = i
                elif observed_idx is None and "observed" in txt:
                    observed_idx = i

                if ritz_idx and observed_idx:
                    break

            for row in rows:
                tds = pq(row)("td")
                try:
                    observed = float(tds[observed_idx].text.replace(" ", ""))
                except (IndexError, TypeError, ValueError):
                    observed = None
                try:
                    ritz = float(tds[ritz_idx].text.replace(" ", ""))
                except (IndexError, TypeError, ValueError):
                    ritz = None
                if ritz or observed:
                    print(f"Observed: {observed}, Ritz: {ritz}")

                # if in visible range
                if observed and 380 <= observed <= 700:
                    element_wavelengths[el.symbol]["observed"].append(observed)
                if ritz and 380 <= ritz <= 700:
                    element_wavelengths[el.symbol]["ritz"].append(ritz)

    with open("wavelength_data.json", "w") as f:
        json.dump(element_wavelengths, f, indent=2)


if __name__ == '__main__':
    main()
