import React, {useState} from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VisibleSpectrum, SpectralLines, visibleUpper, visibleLower } from 'react-emission-spectra'


const App = () => {
  const [tooltipX, setTooltipX] = useState<null | number>(null);
  const [wavelengthAtMouse, setWavelengthAtMouse] = useState<null | number>(null)
  return <div style={{width: 900, margin: "0 auto", paddingBottom: 100}}>
    <h1>Examples for react-emission-spectra</h1>
    Contents:
    <ul>
      <li><a href="#visible">Visible Spectrum</a></li>
      <li><a href="#hydrogen">Hydrogen Emission</a></li>
      <li><a href="#oxygen">Oxygen Absorption</a></li>
      <li><a href="#silicon">Silicon Emission - Custom background</a></li>
      <li><a href="#ununennium">Ununennium Emission - No Data</a></li>
      <li><a href="#custom">Custom Wavelengths</a></li>
      <li><a href="#tooltip">Added Tooltip</a></li>
    </ul>
    <h2 id="visible">Visible Spectrum</h2>
    <SyntaxHighlighter language="javascript" style={dark}>
      {`import React from 'react'
import { VisibleSpectrum, SpectralLines } from 'react-emission-spectra'
const App = () => <div style={{position: "relative", width: "100%", height: 40} }>
    <VisibleSpectrum />
</div>`}
    </SyntaxHighlighter>
    <div style={{position: "relative", width: "100%", height: 40} }><VisibleSpectrum /></div>
    <hr/>
    <h2 id="hydrogen">Hydrogen Emission</h2>
    <SyntaxHighlighter language="javascript" style={dark}>
      {`<SpectralLines elementSymbol="H" spectrumType="emission"/>`}
    </SyntaxHighlighter>
    <div style={{position: "relative", width: "100%", height: 40} }><SpectralLines elementSymbol="H" spectrumType="emission"/></div>
    <hr/>
    <h2 id="oxygen">Oxygen Absorption</h2>
    <SyntaxHighlighter language="javascript" style={dark}>
      {`<SpectralLines elementSymbol="O" spectrumType="absorption" minLineWidth={0.001}/>`}
    </SyntaxHighlighter>
    <div style={{position: "relative", width: "100%", height: 40} }><SpectralLines elementSymbol="O" spectrumType="absorption" minLineWidth={0.001}/></div>
    <hr/>
    <h2 id="silicon">Silicon Emission - Custom background</h2>
    <SyntaxHighlighter language="javascript" style={dark}>{`<SpectralLines background={
      <VisibleSpectrum value={0.25} saturation={0.8}/>
    } elementSymbol="Si" spectrumType="emission" minLineWidth={0.001}/>`}</SyntaxHighlighter>
    <div style={{position: "relative", width: "100%", height: 40} }>
      <SpectralLines background={
        <VisibleSpectrum value={0.25} saturation={0.8}/>
      } elementSymbol="Si" spectrumType="emission" minLineWidth={0.001}/>
    </div>
    <hr/>
    <h2 id="ununennium">Ununennium Emission - No Data</h2>
    <SyntaxHighlighter language="javascript" style={dark}>
      {`<SpectralLines elementSymbol="Uue" spectrumType="emission"/>`}
    </SyntaxHighlighter>
    <div style={{position: "relative", width: "100%", height: 40} }>
      <SpectralLines elementSymbol="Uue" spectrumType="emission"/></div>
    <hr/>
    <h2 id="custom">Custom Wavelengths</h2>
    <SyntaxHighlighter language="javascript" style={dark}>
      {`<SpectralLines wavelengths={[390, 450, 590, 610, 680]} maxLineWidth={0.003} spectrumType="emission"/>`}
    </SyntaxHighlighter>
    <div style={{position: "relative", width: "100%", height: 40} }>
      <SpectralLines wavelengths={[390, 450, 590, 610, 680]} maxLineWidth={0.003} spectrumType="emission"/>
    </div>
    <hr/>
    <h2 id="tooltip">Added Tooltip</h2>
    <SyntaxHighlighter language="javascript" style={dark}>
      {`import {SpectralLines, visibleUpper, visibleLower} from 'react-emission-spectra'
const App = () => {
  const [tooltipX, setTooltipX] = useState<null | number>(null);
  const [wavelengthAtMouse, setWavelengthAtMouse] = useState<null | number>(null)

  return (<div
    style={{position: "relative", width: "100%", height: 40, cursor: "crosshair"} }
    onMouseMove={(event => {
        const percAcross = event.nativeEvent.offsetX / event.currentTarget.offsetWidth;
        setWavelengthAtMouse(visibleUpper - (visibleUpper - visibleLower) * percAcross)
        setTooltipX(percAcross*100);
    })}
    onMouseLeave={()=> setTooltipX(null)}>
      <SpectralLines wavelengths={[390, 450, 590, 610, 680]} maxLineWidth={0.003} spectrumType="emission"/>
      {tooltipX ? <div style={{
        pointerEvents: "none",
        width: 100,
        textAlign: "center",
        marginLeft: -50,
        position: "absolute",
        left: \`\${tooltipX}%\`,
        background: 'black',
        borderRadius: 5,
        color: "white",
        top: 40}}>
          {wavelengthAtMouse?.toFixed(2)} nm
      </div> : null}
  </div>);
}`}
    </SyntaxHighlighter>
    <div style={{position: "relative", width: "100%", height: 40, cursor: "crosshair"} } onMouseMove={(event => {
      const percAcross = event.nativeEvent.offsetX / event.currentTarget.offsetWidth;
      setWavelengthAtMouse(visibleUpper - (visibleUpper - visibleLower) * percAcross)
      setTooltipX(percAcross*100);
    })} onMouseLeave={()=> setTooltipX(null)}>
      <SpectralLines wavelengths={[390, 450, 590, 610, 680]} maxLineWidth={0.003} spectrumType="absorption"/>
      {tooltipX ? <div style={{
        pointerEvents: "none",
        width: 100,
        textAlign: "center",
        marginLeft: -50,
        position: "absolute",
        left: `${tooltipX}%`,
        background: 'black',
        borderRadius: 5,
        color: "white",
        top: 40}}>
          {wavelengthAtMouse?.toFixed(2)} nm
      </div> : null}
    </div>
  </div>
}

export default App
