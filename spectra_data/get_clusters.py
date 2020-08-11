import json
from typing import List, Tuple

from sklearn.cluster import KMeans
import numpy as np


def j(i, d: List[float]):
    return d[i] - d[i - 1]


# https://en.wikipedia.org/wiki/Determining_the_number_of_clusters_in_a_data_set#An_information%E2%80%93theoretic_approach
def jump_method(data: List[int], max_k: int) -> Tuple[int, KMeans]:
    y = 1. / 2.  # 1 dimensional array
    d = [0.]
    clusters_for_k = {}
    shaped_data = np.array(data).reshape(-1, 1)
    for k in range(1, max_k + 1):
        clusters = KMeans(k).fit(shaped_data)
        clusters_for_k[k] = clusters
        distortion = clusters.inertia_
        try:
            d.append(pow(distortion, -y))
        except ZeroDivisionError:
            d.append(0.)
    max_jk = 0
    max_jk_k = 1
    for k in range(1, max_k + 1):
        jk = j(k, d)
        if jk > max_jk:
            max_jk = jk
            max_jk_k = k
    return max_jk_k, clusters_for_k[max_jk_k]


def generate_clustered_data():
    with open("wavelength_data.json") as f:
        wavelength_data = json.load(f)

    clustered_data = {}
    for element_symbol, wavelengths in wavelength_data.items():
        combined = wavelengths["observed"] + wavelengths["ritz"]
        if not len(combined):
            clustered_data[element_symbol] = []
            continue
        k, clusters = jump_method(combined, min(len(combined), 35))  # assume not more than 35 distinct lines
        clustered_data[element_symbol] = []
        centers = clusters.cluster_centers_
        predicted_cluster_membership = clusters.predict(np.array(combined).reshape(-1, 1))
        for i, center in enumerate(centers):
            values_in_cluster = [combined[j] for j, cluster_idx in enumerate(predicted_cluster_membership) if
                                 cluster_idx == i]
            cluster_values_of_interest = {
                "centroid": center[0],
                "min": min(values_in_cluster) if len(values_in_cluster) else center[0],
                "max": max(values_in_cluster) if len(values_in_cluster) else center[0],
                "values_in_cluster": values_in_cluster
            }
            print("For ", element_symbol, cluster_values_of_interest)
            clustered_data[element_symbol].append(cluster_values_of_interest)
        clustered_data[element_symbol].sort(key=lambda d: d["centroid"])

    with open("clustered_data.json", "w") as f:
        json.dump(clustered_data, f)


if __name__ == '__main__':
    generate_clustered_data()
