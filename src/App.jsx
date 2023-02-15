import './App.css'
import { MapView } from './MapView'
import {
  useState,
} from "react";



const addPoint = (points, setPoints) => {
  console.log(points)
  setPoints([...points, {
    name: Math.random().toString(), coordinate: [Math.random() * 1000000, Math.random() * 1000000]
  }])
}


const PointInfoArea = ({ selectedPoints }) => {
  return (<div>
    <div>
      Selected point
    </div>
    {selectedPoints.map(s => <div>Name: {s.name}</div>)}
  </div >)
}

function App() {

  const [selectedPoints, setSelectedPoints] = useState([]);
  const [points, setPoints] = useState([
    { name: '67407', coordinate: [67407.3609068255, -48424.000743312456] },
    { name: '77809', coordinate: [-77809.69087466034, -45063.73644258009] },
    { name: '37590', coordinate: [37590.37353834105, 64001.50753808682] },
    { name: '71694', coordinate: [-71694.99329685087, 60732.028906339765] },
  ])



  return (
    <div className="App">
      <div className='controlview' > controls
        <div>
          <button onClick={() => addPoint(points, setPoints)}></button>
        </div>

        {selectedPoints.length > 0 ? <PointInfoArea selectedPoints={selectedPoints} /> : null}
      </div>
      <MapView className={"mapview"} points={points} setSelectedPoints={setSelectedPoints}></MapView>
    </div>
  )
}

export default App
