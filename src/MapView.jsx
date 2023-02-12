import React,{useState,useCallback} from "react";
import "ol/ol.css";
import { Map } from "@react-ol/fiber";
import TileGrid from 'ol/tilegrid/TileGrid.js';


import { Point } from "ol/geom";




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
  const [coordinates, setCoordinates] = useState(undefined);
  const [popup, setPopup] = useState(null);


  const onClick = useCallback(
    (evt) => {
      if (!map) return;
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const coordinate = feature.getGeometry().getCoordinates();
        setCoordinates(coordinate);
      } else {
        setCoordinates(undefined);
      }
    },
    [map]
  );

  const onPointermove = useCallback(
    (e) => {
      if (!map) return;
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? "pointer" : "";
    },
    [map]
  );

  
  return (
    <>
      <div ref={setPopup}>
        <div>
          <p>Null Island</p>
        </div>
      </div>
    
  <div className={className}>
    <Map ref={setMap} style={{ width: "100%", height: "96vh" }} onPointermove={onPointermove} onClick={onClick} >

    {popup ? (
          <olOverlay
            offset={[0, -30]}
            position={coordinates}
            element={popup}
            args={{
              stopEvent: false,
            }}
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

      <olLayerVector>
          <olSourceVector>
            <olFeature>
              <olStyleStyle attach="style">
                <olStyleIcon
                  attach="image"
                  args={{
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: "/vite.svg",
                  }}
                />
              </olStyleStyle>
              <olGeomPoint coordinates={[0, 0]} />
            </olFeature>
          </olSourceVector>
        </olLayerVector>

    </Map>
  </div>
  </>
)};
