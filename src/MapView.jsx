import React, {
  useState,
  // useEffect,
  useMemo,
  useCallback
} from "react";


import "ol/ol.css";
import "./MapView.css";

import { Map } from "@react-ol/fiber";
import TileGrid from 'ol/tilegrid/TileGrid.js';

import { click, pointerMove, altKeyOnly } from "ol/events/condition";

import { Style, Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";



// import { create } from 'zustand'
// const featureStore = create((set) => ({
//   features: [],
//   add: (n) => set((state) => ({ features: [...features, n] })),
//   // bears: 0,
//   // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   // removeAllBears: () => set({ bears: 0 }),
// }))



const WarhammerMainMap = <olLayerTile preload={10} >
  <olSourceXYZ tileUrlFunction={([z, x, y]) => {
    if (z > 7) return null
    return `http://www.gitzmansgallery.com/tiles/${z}_${x}_${y}.jpg`
  }
  } />
</olLayerTile >


const MarienburgMap = <olLayerTile preload={3} minZoom={7}>
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


const AltdorfMap = <olLayerTile preload={3} minZoom={7}>
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


// styling items
const clusterStyle = (feature) => {
  const size = feature.get("features").length;
  let style = styleCache[size];
  if (!style) {
    style = new Style({
      image: new CircleStyle({
        radius: 10,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: "#3399CC",
        }),
      }),
      text: new Text({
        text: size == 1 ? "Image" : size.toString(),
        fill: new Fill({
          color: "#fff",
        }),
      }),
    });
    styleCache[size] = style;
  }
  return style;
}


export const styleCache = [];


// const FindPointAtCoord = (coord, points)=>{}

export const MapView = ({ className, points, setSelectedPoints }) => {


  const [map, setMap] = useState(null);
  const [displayText, setDisplayText] = useState(null);
  const [previewPoint, setPreviewPoint] = useState([]);
  const [popup, setPopup] = useState(null);




  const onClick = useCallback(
    ({ coordinate }) => console.log({ coordinate }), []
  )


  const handleMove = useCallback((e) => {




    var hovered = e.target.getFeatures().getArray().map(select =>
      points.find(({ coordinate }) =>
        coordinate.join() == select.getGeometry().getCoordinates().join()))
    setPreviewPoint(hovered)

  }, [points]);


  const handleClick = useCallback((e) => {
    var selected = e.target.getFeatures().getArray().map(select =>
      points.find(({ coordinate }) =>
        coordinate.join() == select.getGeometry().getCoordinates().join()))
    setSelectedPoints(selected)

  }, [points]);







  return (
    <>
      <div className='mapview'>
        {/* hidden popup waiting for usafe */}
        <div className="hidden-popup-container" >
          <div ref={setPopup} className='preview-popup'>
            <img className="preview-image" src={(previewPoint.length > 0 && previewPoint[0].src || './locations/resturant.png')} alt="" />
            {previewPoint.length > 0 ? <div>{previewPoint[0]?.name || "lmao"}</div> : null}
          </div>
        </div>


        {/* the map */}
        <Map ref={setMap}
          style={{ width: "100%", height: "96vh" }}
          onSingleclick={onClick} >

          {/* the map popup */}
          {previewPoint.length > 0 ? (
            <olOverlay
              element={popup}
              position={previewPoint[0].coordinate}
              positioning={'bottom-center'}
              offset={[0, -12]}
            />
          ) : null}



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
          <olLayerVector
            // style={new Style({
            //   radius: 100,

            //   text: new Text({
            //     scale:4,
            //     text: "📍"
            //   })
            // })}
          >
            {/* <olSourceCluster distance={40} minDistance={20}> */}
            <olSourceVector >
              {points.map(p => <olFeature key={p.coordinate.join()}  >
                <olGeomPoint coordinates={p.coordinate} />
              </olFeature>)}
            </olSourceVector>
            {/* </olSourceCluster> */}
          </olLayerVector>


          <olInteractionSelect
            args={{ condition: click }}
            // style={selectedStyleFunction}
            onSelect={handleClick}
          />

          <olInteractionSelect
            args={{ condition: pointerMove }}
            // style={selectedStyleFunction}
            onSelect={handleMove}
          />

        </Map>
      </div>
    </>
  )
};



