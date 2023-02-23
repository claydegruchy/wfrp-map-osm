import './App.css'
import { MapView } from './MapView'
import { ControlPanel } from './Controls'
import {
  useState,
} from "react";

import { LoginHandler } from './Login'
import { GetPoints, AddPoint, DeletePoint, auth } from './firebase'
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react';



const FloatingControlPanel = ({ children }) => <div className='absolute z-10 top-5 left-5 flex flex-col justify-items-start' >{children}</div>

function App() {

  const [user, loading, error] = useAuthState(auth);

  const [points, setPoints] = useState([])
  
  // point selection
  const [selectedPoints, setSelectedPoints] = useState([]);
  // relates to opening dialog boxes from within the map
  const [addPointDialogOpen, setAddPointDialogOpen] = useState(false)
  const [addPointDialogCoordinate, setAddPointDialogCoordinate] = useState(false)

  const [mapCommunications, setMapCommunications] = useState(null)



  const PreSelectPoint = ()=>{
    console.log(mapCommunications);
    const url = new URLSearchParams(location.search)
    var id = url.get('id')
    if(!id || mapCommunications) return
    var target = points.find(p=>p.id ==id)
    if(!target) return
    setSelectedPoints([target])
    let t = new URL(location.href)
    t.searchParams.delete('id', null)
    // remove this so we dont repeatedly open the same point
    // window.history.pushState(null, "", t.href);
  }

useEffect(e=>{
  // only do this once
  PreSelectPoint()
},[points,mapCommunications])


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

  const addNewPointHook = async ({ pointData, file, thumbnail }) => {
    let point = {
      public: false,
      ...pointData,
      coordinates: addPointDialogCoordinate,
    }
    await AddPoint({ point, file, thumbnail })
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
    <div className="App flex">



      <div className='flex-0' >




      </div >
        <FloatingControlPanel>
          <LoginHandler authChangeHook={updatePointList} />
          <div>
          {openControls ? <ControlPanel
          points={points}
          selectedPoints={selectedPoints}
          addNewPointHook={addNewPointHook}
          removePointHook={removePointHook}
          addPointDialogOpen={addPointDialogOpen}
          closePointDialog={closePointDialogHook}
          user={user}
        /> : null}
        </div>
        </FloatingControlPanel>
        <MapView
          points={points}
          setSelectedPoints={setSelectedPoints}
          newLocationHook={openPointDialogHook}
          addPointDialogOpen={addPointDialogOpen}
          user={user}
          setMapCommunications={setMapCommunications}
          mapCommunications={mapCommunications}
          className={'flex-1'}
        ></MapView>
    </div>
  )
}

export default App
