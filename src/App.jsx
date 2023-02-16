import './App.css'
import { MapView } from './MapView'
import { ControlPanel } from './Controls'
import {
  useState,
} from "react";

import { LoginHandler } from './Login'





function App() {



  const [points, setPoints] = useState([
    { type: 'image', name: "resturant", coordinate: [0, 0], src: "./locations/resturant.png", },
    { type: 'image', name: "brothel", coordinate: [-77809.69087466034, -45063.73644258009], src: "./locations/brothel.png", },
    { type: 'image', name: "casino", coordinate: [37590.37353834105, 64001.50753808682], src: "./locations/casino.png", },
    { type: 'image', name: 'canal', coordinate: [-71694.99329685087, 60732.028906339765], src: "./locations/deg_14th_century_dutch_canal_city_in_background_crowds_tall_bui_90750d10-6c19-4f79-96ee-e4b49c6c6fca.png", },
  ])


  const [selectedPoints, setSelectedPoints] = useState([]);
  const [addPointDialogOpen, setAddPointDialogOpen] = useState(false)
  const [addPointDialogCoordinate, setAddPointDialogCoordinate] = useState(false)

  const newLocationHook = ({ coordinates }) => {
    setAddPointDialogOpen(true)
    setAddPointDialogCoordinate(coordinates)
  }

  const addNewPoint = ({ src, name }) => {
    setPoints([...points, {
      src, name, coordinate: addPointDialogCoordinate
    }])
  }

  const closePointDialog = () => {
    setAddPointDialogOpen(false)
    setAddPointDialogCoordinate(null)
  }

  return (
    <div className="App">
      <div>
        <LoginHandler />

        <ControlPanel
          points={points}
          selectedPoints={selectedPoints}
          addNewPoint={addNewPoint}
          addPointDialogOpen={addPointDialogOpen}
          closePointDialog={closePointDialog}
        />
      </div>
      <MapView
        points={points}
        setSelectedPoints={setSelectedPoints}
        newLocationHook={newLocationHook}
        addPointDialogOpen={addPointDialogOpen}
      ></MapView>
    </div>
  )
}

export default App
