import './App.css'
import { MapView } from './MapView'
import { ControlPanel } from './Controls'
import {
  useState,
} from "react";

import { LoginDialog, HelpDialog } from './DialogBoxes'
import { GetPoints, AddPoint, DeletePoint, auth } from './firebase'
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';

import { AddBulkPoints } from './Utilities'





function App() {

  const [user, loading, error] = useAuthState(auth);

  const [points, setPoints] = useState([])

  // point selection
  const [selectedPoints, setSelectedPoints] = useState([]);
  // relates to opening dialog boxes from within the map
  const [addPointDialogOpen, setAddPointDialogOpen] = useState(false)
  const [addPointDialogCoordinate, setAddPointDialogCoordinate] = useState(false)

  const [mapCommunications, setMapCommunications] = useState(null)



  const PreSelectPoint = () => {
    const url = new URLSearchParams(location.search)
    var id = url.get('id')
    if (!id || mapCommunications) return
    var target = points.find(p => p.id == id)
    if (!target) return
    setSelectedPoints([target])
    let t = new URL(location.href)
    t.searchParams.delete('id', null)
    // remove this so we dont repeatedly open the same point
    // window.history.pushState(null, "", t.href);
  }

  useEffect(e => {
    // only do this once
    PreSelectPoint()
  }, [points, mapCommunications])


  const openControls = selectedPoints.length > 0 || addPointDialogOpen

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
    PreSelectPoint()

  }
  const deselectPoint = (i) => setSelectedPoints(selectedPoints.filter((item, index) => index != i))


  const addNewPointHook = async ({ pointData, imageFiles, thumbnail }) => {
    console.log("[addNewPointHook]", { pointData });
    let point = {
      public: false,
      coordinates: addPointDialogCoordinate,
      ...pointData,
    }
    console.log("[addNewPointHook]", { point });

    await AddPoint({ point, imageFiles, thumbnail })
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
    <div className="App flex h-screen">
      {/* enable for bulk addition operations */}
      {/* <AddBulkPoints addNewPointHook={addNewPointHook} points={points} /> */}
      <div className=' absolute flex gap-2 z-10 top-2 left-2' >
        <LoginDialog authChangeHook={updatePointList} />
        <HelpDialog />
      </div>
      <div className=' absolute flex z-10 bottom-0 ' >

        {openControls ? <ControlPanel
          points={points}
          selectedPoints={selectedPoints}
          deselectPoint={deselectPoint}
          addNewPointHook={addNewPointHook}
          removePointHook={removePointHook}
          addPointDialogOpen={addPointDialogOpen}
          closePointDialog={closePointDialogHook}
          user={user}
        /> : null}
      </div>


      <MapView
        points={points}
        setSelectedPoints={setSelectedPoints}
        newLocationHook={openPointDialogHook}
        addPointDialogOpen={addPointDialogOpen}
        user={user}
        setMapCommunications={setMapCommunications}

        className={'flex-1'}
      ></MapView>
    </div>
  )
}

export default App
