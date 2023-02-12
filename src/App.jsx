import { useState } from 'react'
import './App.css'
import { MapView } from './MapView'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className="App">
        <div className='controlview' > controls</div>
        <MapView className={"mapview"}></MapView>
      </div>
  )
}

export default App
