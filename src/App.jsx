import './App.css'
import { MapView } from './MapView'
import {
  useState,
} from "react";

import { saveAs } from 'file-saver';




const addPoint = (points, setPoints) => {
  console.log(points)
  setPoints([...points, {
    name: Math.random().toString(), coordinate: [Math.random() * 1000000, Math.random() * 1000000]
  }])
}


const PointInfoCard = ({ point: { name, coordinate, src } }) => {
  // add button states for feedback
  const downloadImage = () => saveAs(src, name + '.png')
  const copyLink = () => navigator.clipboard.writeText(location.href+name+coordinate)


  return (
    <div className='card' >
      <img key={coordinate.join()} src={src}></img>
      <div className='name'> {name}</div>
      <div>
        <button title="Download" onClick={downloadImage}>⏬</button>
        <button title="Share" onClick={copyLink}>🔗</button>
        
        </div>

    </div>
  )
}


const PointInfoContainer = ({ selectedPoints }) => {
  return (
    <div >
      <h3 >
        Selected point{selectedPoints.length > 1 ? "s" : ""}
      </h3>
      <div className='point-container'>
        {selectedPoints.map(p => <PointInfoCard point={p} />)}
      </div>
    </div >)
}

function App() {

  const [points, setPoints] = useState([
    { type: 'image', name: "resturant", coordinate: [0, 0], src: "./locations/resturant.png", },
    { type: 'image', name: "brothel", coordinate: [-77809.69087466034, -45063.73644258009], src: "./locations/brothel.png", },
    { type: 'image', name: "casino", coordinate: [37590.37353834105, 64001.50753808682], src: "./locations/casino.png", },
    { type: 'image', name: 'canal', coordinate: [-71694.99329685087, 60732.028906339765], src: "./locations/deg_14th_century_dutch_canal_city_in_background_crowds_tall_bui_90750d10-6c19-4f79-96ee-e4b49c6c6fca.png", },
  ])


  const [selectedPoints, setSelectedPoints] = useState([]);


  return (
    <div className="App">
      <div className='controlview' > controls
        <div>
          <button onClick={() => addPoint(points, setPoints)}></button>
        </div>

        {selectedPoints.length > 0 ? <PointInfoContainer selectedPoints={selectedPoints} /> : null}
      </div>
      <MapView className={"mapview"} points={points} setSelectedPoints={setSelectedPoints}></MapView>
    </div>
  )
}

export default App
