import json
import mendeleev


def main():
    with open("clustered_data.json") as f:
        cd = json.load(f)

    all_elements = set([e.symbol for e in mendeleev.get_all_elements()])
    data_elements = set([sym for sym, data in cd.items() if len(data)])
    with open("missing_elements.json", "w") as f:
        json.dump(list(all_elements.difference(data_elements)), f)


if __name__ == '__main__':
    main()
