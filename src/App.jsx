import './App.css'
import { MapView } from './MapView'
import { ControlPanel } from './Controls'
import {
  useState,
} from "react";



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
<ControlPanel points={points} setPoints={setPoints} selectedPoints={selectedPoints} setSelectedPoints={setSelectedPoints} />
      <MapView points={points} setSelectedPoints={setSelectedPoints}></MapView>
    </div>
  )
}

export default App
