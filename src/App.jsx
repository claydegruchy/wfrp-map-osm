import './App.css'
import { MapView } from './MapView'
import { ControlPanel } from './Controls'
import {
  useState,
} from "react";

import { LoginHandler } from './Login'
import { GetPoints, AddPoint,auth } from './firebase'
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
    setPoints(await GetPoints())
  }

  const addNewPointHook = async (data) => {
    let point = {
      public: false,
      ...data,
      coordinates: addPointDialogCoordinate
    }
    await AddPoint({point})
    await updatePointList()
    
  }

  const removePointHook = async()=>{
    // where owner is user, 
  }



  return (
    <div className="App">
      <div>
        <LoginHandler authChangeHook={updatePointList} />


        <ControlPanel
          points={points}
          selectedPoints={selectedPoints}
          addNewPointHook={addNewPointHook}
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
