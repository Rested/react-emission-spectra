# Spectra data

## Scraping

This directory contains the code to scrape the emission spectrum data.

To run this and generate the `wavelength_data.json` run:

```bash
pip install -r requirements.txt
python scrape_data.py
```

## Spectral image generation demo

A demo for the spectral image generation also lives here, to play with it:

```bash
npm i
npm run demo
```


## Clustering

The data is then clustered using the jump method (to get k) k-means to get the cluster centroids.
To run:
```bash
python get_clusters.py
```