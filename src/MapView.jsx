import React,{useState} from "react";
import "ol/ol.css";
import { Map } from "@react-ol/fiber";

import TileGrid from 'ol/tilegrid/TileGrid.js';



const WarhammerMainMap = <olLayerTile preload={10} >
  <olSourceXYZ tileUrlFunction={([z, x, y]) => {
    if (z > 7) return null
    return `http://www.gitzmansgallery.com/tiles/${z}_${x}_${y}.jpg`
  }
  } />
</olLayerTile >


const MarienburgMap = <olLayerTile preload={10} minZoom={7}>
  <olSourceTileImage
    tileGrid={new TileGrid({
      extent: [-3320017.90883266041, 4701281.93297282793, -3175634.72078718198, 4803354.42623188905],
      origin: [-3320017.90883266041, 4701281.93297282793],
      resolutions: [658.532214574588806, 329.266107287294403, 164.633053643647202, 82.3165268218236008, 41.1582634109118004, 20.5791317054559002, 10.2895658527279501, 5.14478292636397505],
      tileSize: [256, 256]
    })}
    tileUrlFunction={(tileCoord) => {
      return ('./marienburg/{z}/{x}/{y}.png'
        .replace('{z}', String(tileCoord[0]))
        .replace('{x}', String(tileCoord[1]))
        .replace('{y}', String(- 1 - tileCoord[2])));
    }}>
  </olSourceTileImage>
</olLayerTile>


const AltdorfMap = <olLayerTile preload={10} minZoom={7}>
  <olSourceTileImage
    tileGrid={new TileGrid({
      extent: [-1879572.67834710842, 3734469.05619834783, -1754782.27834710851, 3824113.85619834764],
      origin: [-1879572.67834710842, 3734469.05619834783],
      resolutions: [537.600000000000023, 268.800000000000011, 134.400000000000006, 67.2000000000000028, 33.6000000000000014, 16.8000000000000007, 8.40000000000000036, 4.20000000000000018],
      tileSize: [256, 256]
    })}
    tileUrlFunction={(tileCoord) => {
      return ('./altdorf/{z}/{x}/{y}.png'
        .replace('{z}', String(tileCoord[0]))
        .replace('{x}', String(tileCoord[1]))
        .replace('{y}', String(- 1 - tileCoord[2])));
    }}>
  </olSourceTileImage>
</olLayerTile>


export const MapView = ({ className }) =>  {
  
  
  const [map, setMap] = useState(null);

  
  return (
  <div className={className}>
    <Map ref={setMap} style={{ width: "100%", height: "96vh" }} tabindex="0" >
      {/* controls */}
      {/* <olControlOverviewMap layers={[]} /> */}
      <olControlRotate />
      <olControlFullScreen />
      {/* <olControlScaleLine render={console.log} /> */}
      
      {/* view */}
      <olView initialCenter={[0, 0]} initialZoom={10} />
      {/* layers */}
      {WarhammerMainMap}
      {MarienburgMap}
      {AltdorfMap}

      {/* points */}



    </Map>
  </div>
)};
