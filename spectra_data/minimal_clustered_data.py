import json

if __name__ == "__main__":
    with open("clustered_data.json") as f:
        d = json.load(f)

    for e in d:
        for c in d[e]:
            del c["values_in_cluster"]

    with open("minimal_clustered_data.json", "w") as f:
        json.dump(d, f)