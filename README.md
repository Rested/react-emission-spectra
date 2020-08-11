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

## License

MIT © [Rested](https://github.com/Rested)
