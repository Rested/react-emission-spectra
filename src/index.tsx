import * as React from 'react'
import tinygradient from 'tinygradient'
import clusteredEmissionData from './clustered_data'

// import styles from './styles.module.css'

interface VisibleSpectrumProps {
  saturation?: number
  value?: number
  alpha?: number
}

export const visibleUpper = 700 // left
export const visibleLower = 380 // right

const colorStops = Array.from(Array(7).keys()).map((i) => i * (360 / 7))
const visibleSpectrumFull = tinygradient(
  colorStops.map((h) => ({ h, s: 1, v: 1, a: 1 }))
)

function visibleSpectrumGradient(s: number, v: number, a: number) {
  return tinygradient(colorStops.map((h) => ({ h, s, v, a })))
}

export const VisibleSpectrum = ({
  saturation = 1,
  value = 1,
  alpha = 1
}: VisibleSpectrumProps) => {
  return (
    <div
      style={{
        background: visibleSpectrumGradient(
          saturation as number,
          value as number,
          alpha as number
        ).css(),
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  )
}

type SpectrumType = 'emission' | 'absorption'

interface BaseSpectralLinesProps {
  background?: React.ReactElement
  minLineWidth?: number
  maxLineWidth?: number
  spectrumType: SpectrumType
}

interface ElementSpectralLinesProps extends BaseSpectralLinesProps {
  elementSymbol: string
  wavelengths?: undefined
}

interface WaveLengthsSpectralLinesProps extends BaseSpectralLinesProps {
  wavelengths: number[]
  elementSymbol?: undefined
}

function getWavelengthPosition(wavelength: number) {
  return 1 - (wavelength - visibleLower) / (visibleUpper - visibleLower)
}

const transparent = { h: 0, s: 1, v: 1, a: 0 }

const minGap = 0.00000000001

function addStops(
  stopArr: object[],
  startPos: number,
  endPos: number,
  spectrumType: SpectrumType,
  replacePrevEnd: boolean
) {
  if (!replacePrevEnd) {
    stopArr.push({ color: transparent, pos: startPos - minGap * 2 })
    stopArr.push({ pos: startPos - minGap })
    stopArr.push({
      color:
        spectrumType === 'emission'
          ? visibleSpectrumFull.hsvAt(startPos).toHsv()
          : '#000000',
      pos: startPos
    })
    stopArr.push({
      color:
        spectrumType === 'emission'
          ? visibleSpectrumFull.hsvAt(endPos).toHsv()
          : '#000000',
      pos: endPos
    })
    stopArr.push({ color: transparent, pos: endPos + minGap })
  } else {
    stopArr[stopArr.length - 2] = {
      color:
        spectrumType === 'emission'
          ? visibleSpectrumFull.hsvAt(endPos).toHsv()
          : '#000000',
      pos: endPos
    }
    stopArr[stopArr.length - 1] = { color: transparent, pos: endPos + minGap }
  }
}

type ClusterDataPoint = {
  min: number | null
  max: number | null
  centroid: number
}

export const SpectralLines = ({
  background,
  elementSymbol,
  wavelengths,
  minLineWidth = 0.005,
  maxLineWidth = 0.01,
  spectrumType
}: ElementSpectralLinesProps | WaveLengthsSpectralLinesProps) => {
  const stops = [{ color: transparent, pos: 0 }]
  if (elementSymbol) {
    let prevStart: number | null = null
    let prevEnd: number | null = null

    ;(clusteredEmissionData[elementSymbol] || [])
      .sort(
        (a: ClusterDataPoint, b: ClusterDataPoint) => b.centroid - a.centroid
      )
      .forEach(({ min, max, centroid }: ClusterDataPoint) => {
        let startPos: number
        let endPos: number
        if (!(min && max)) {
          startPos = centroid - maxLineWidth / 2
          endPos = centroid + maxLineWidth / 2
        } else {
          startPos = getWavelengthPosition(min)
          endPos = getWavelengthPosition(max)
        }
        console.log('initial', startPos, endPos, min, max)

        if (endPos - startPos < minLineWidth) {
          const centroidPos = getWavelengthPosition(centroid)
          startPos = centroidPos - minLineWidth / 2
          endPos = centroidPos + minLineWidth / 2
        } else if (endPos - startPos > maxLineWidth) {
          const centroidPos = getWavelengthPosition(centroid)
          startPos = centroidPos - maxLineWidth / 2
          endPos = centroidPos + maxLineWidth / 2
        }
        // console.log('middle', startPos, endPos)
        startPos = Math.min(1 - minGap * 3, Math.max(minGap * 3, startPos))
        endPos = Math.max(minGap * 3, Math.min(1 - minGap * 3, endPos))

        // console.log('final', startPos, endPos)
        let skip = false
        let replacePrevEnd = false
        if (prevEnd && prevStart) {
          if (startPos <= prevEnd) {
            if (endPos <= prevEnd) {
              skip = true
            }
            replacePrevEnd = true
            prevEnd = endPos
          }
        } else {
          prevStart = startPos
          prevEnd = endPos
        }
        // console.log(skip, replacePrevEnd, prevEnd, prevStart)

        if (!skip) {
          addStops(stops, startPos, endPos, spectrumType, replacePrevEnd)
        }
      })
  } else {
    if (wavelengths) {
      wavelengths
        .sort((a, b) => b - a)
        .forEach((wavelength) => {
          if (wavelength < visibleLower || wavelength > visibleUpper) {
            throw new Error(
              `bad wavelength ${wavelength} not in visible range (${visibleLower}-${visibleUpper})`
            )
          }
          let startPos = getWavelengthPosition(wavelength) - maxLineWidth / 2
          let endPos = getWavelengthPosition(wavelength) + maxLineWidth / 2
          startPos = Math.max(0.00003, startPos)
          endPos = Math.min(1 - 0.00002, endPos)
          addStops(stops, startPos, endPos, spectrumType, false)
        })
    }
  }
  if (stops.length === 1) {
    stops.push({ color: transparent, pos: 1 })
  }
  stops.sort((a, b) => a.pos - b.pos)
  console.log(stops)
  const gradient = tinygradient(stops).css()
  return (
    <React.Fragment>
      {background || (
        <VisibleSpectrum
          saturation={1}
          value={spectrumType === 'emission' ? 0.6 : 1}
          alpha={1}
        />
      )}
      <div
        style={{
          background: gradient,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </React.Fragment>
  )
}
