import './App.css'
import { MapView } from './MapView'
import { ControlPanel } from './Controls'
import {
  useState,
} from "react";

import { LoginHandler } from './Login'
import { GetPoints, AddPoint, DeletePoint, auth } from './firebase'
import { useAuthState } from "react-firebase-hooks/auth";



function App() {

  const [user, loading, error] = useAuthState(auth);

  const [points, setPoints] = useState([])

  // point selection
  const [selectedPoints, setSelectedPoints] = useState([]);
  // relates to opening dialog boxes from within the map
  const [addPointDialogOpen, setAddPointDialogOpen] = useState(false)
  const [addPointDialogCoordinate, setAddPointDialogCoordinate] = useState(false)

  const openPointDialogHook = ({ coordinates }) => {
    setAddPointDialogOpen(true)
    setAddPointDialogCoordinate(coordinates)
  }

  const closePointDialogHook = () => {
    setAddPointDialogOpen(false)
    setAddPointDialogCoordinate(null)
  }


  const updatePointList = async () => {
    setPoints(await GetPoints() || [])
  }

  const addNewPointHook = async ({ pointData, file }) => {
    let point = {
      public: false,
      ...pointData,
      coordinates: addPointDialogCoordinate,
    }
    await AddPoint({ point, file })
    await updatePointList()

  }

  const removePointHook = async (id) => {
    // where owner is user, 
    // console.table(selectedPoints)
    // console.table()
    await DeletePoint(id)
    .then(() => setSelectedPoints(selectedPoints.filter((p) => p.id != id)))
    .catch(console.error)

    await updatePointList()
  }



  return (
    <div className="App">
      <div>
        <LoginHandler authChangeHook={updatePointList} />

        {/* <button onClick={GetPoints}>p</button> */}
        <ControlPanel
          points={points}
          selectedPoints={selectedPoints}
          addNewPointHook={addNewPointHook}
          removePointHook={removePointHook}
          addPointDialogOpen={addPointDialogOpen}
          closePointDialog={closePointDialogHook}
          user={user}
        />
      </div>
      <MapView
        points={points}
        setSelectedPoints={setSelectedPoints}
        newLocationHook={openPointDialogHook}
        addPointDialogOpen={addPointDialogOpen}
        user={user}

      ></MapView>
    </div>
  )
}

export default App
