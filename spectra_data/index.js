import tinygradient from 'tinygradient';
import wavelengthData from './wavelength_data.json'


const visibleUpper = 700; // left
const visibleLower = 380; // right

const colorStops = Array.from(Array(7).keys()).map(i => i * 51.4285714286)

const visibleSpectrum = tinygradient(colorStops.map(h => ({h, s: 1, v: 1, a: 1})))
console.log(visibleSpectrum.css())


const integerVals = []
wavelengthData["H"]["ritz"].forEach(val => {
  if (!integerVals.includes(Math.ceil(val))) {
    integerVals.push(Math.ceil(val))
  }
});

const hydrogenGradStops = [{color: {h: 0, s: 1, v: 1, a: 0}, pos: 0}]
integerVals.sort((a, b) => b - a).forEach(iv => {
  const startPos = 1 - ((iv - visibleLower) / (visibleUpper - visibleLower))
  const endPos = 1 - ((iv - 1 - visibleLower) / (visibleUpper - visibleLower))
  hydrogenGradStops.push({color: {h: 0, s: 1, v: 1, a: 0}, pos: startPos - 0.00002})
  hydrogenGradStops.push({pos: startPos - 0.00001})
  hydrogenGradStops.push({
    color: visibleSpectrum.hsvAt(startPos).toHsv(),
    pos: startPos
  })
  hydrogenGradStops.push({
    color: visibleSpectrum.hsvAt(endPos).toHsv(),
    pos: endPos
  })
  hydrogenGradStops.push({color: {h: 0, s: 1, v: 1, a: 0}, pos: endPos + 0.00001})
})
console.log(hydrogenGradStops);
console.log(tinygradient(hydrogenGradStops).css())

const darkVisibleSpectrum = tinygradient(colorStops.map(h => ({h, s: 1, v: 0.5, a: 1})));

console.log(darkVisibleSpectrum.css())
