# react-emission-spectra

> a set of react components for visualising the visible emission and absorption spectra of chemical elements

[![NPM](https://img.shields.io/npm/v/react-emission-spectra.svg)](https://www.npmjs.com/package/react-emission-spectra) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-emission-spectra
```

## Usage

```tsx
import React, { Component } from 'react'

import {SpectralLines} from 'react-emission-spectra'

class Example extends Component {
  render() {
    return <SpectralLines elementSymbol="H" spectrumType="emission"/>
  }
}
```

For more examples see
[https://rested.github.io/react-emission-spectra/](https://rested.github.io/react-emission-spectra/)

## How it works

### The data

The data for the emission/absorption spectrum for each element comes from the
[NIST Atomic Spectra Database Lines Form](https://physics.nist.gov/PhysRefData/ASD/lines_form.html).
This collection code can be found [here](./spectra_data/scrape_data.py).

The data then gets processed into clusters using the
[jump method](https://en.wikipedia.org/wiki/Determining_the_number_of_clusters_in_a_data_set#An_information%E2%80%93theoretic_approach)
and K-Means. The code for this can be found [here](./spectra_data/get_clusters.py).

The data for some elements is missing, the full list can be found [here](./spectra_data/missing_elements.json).

### The rendering

The rendering uses css gradients generated using the fantastic
[tinygradient](https://physics.nist.gov/PhysRefData/ASD/lines_form.html) library. This avoids cluttering the dom with
extra elements and ensures native rendering.


## License

MIT © [Rested](https://github.com/Rested)
