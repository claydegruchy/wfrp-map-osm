import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";


import "ol/ol.css";
import "./MapView.css";

import { Map } from "@react-ol/fiber";

import { click, pointerMove, altKeyOnly } from "ol/events/condition";

import { Style, Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import Polygon from "ol/geom/Polygon";


import crop from "ol-ext/filter/Crop";
import convex from "@turf/convex";
import { point, featureCollection } from "@turf/helpers";
import {
  getCoords,
  mask,
  explode,
  union,
  simplify,
  concave,

} from '@turf/turf'




import { isMobile } from 'react-device-detect';

import {
  WarhammerMainMap,
  MarienburgMap,
  AltdorfMap,
  BelAliad,
  Carroburg,
  Kemperbad,
  Miragliano,
  Nuln,
  Praag,
  Sartosa,
  Ubersreik,
} from './Maps'
import { VoronoiCells } from "./components/VoronoiCells";
import { DelaunayCells } from "./components/DelaunayCells";



export const styleBuilder = (i = {}) => {
  // this immense clunky hunk of shit sets the styles

  let {
    strokeWidth,
    strokeColor,
    fillColor,
    circleRadius,
    txt,
  } = {
    strokeWidth: 1.25,
    strokeColor: '#3399CC',
    fillColor: 'rgba(255,255,255,0.1)',
    circleRadius: 5,
    txt: '',
    ...i
  }

  const fill = new Fill({
    color: fillColor,
  });
  const stroke = new Stroke({
    color: strokeColor,
    width: strokeWidth,
  });
  const text = new Text({
    text: txt,
    scale: 1.3,
    fill: new Fill({
      color: '#000000'
    }),
    stroke: new Stroke({
      color: '#FFFF99',
      width: 3.5
    })
  })

  return new Style({
    image: new CircleStyle({
      fill: fill,
      stroke: stroke,
      radius: circleRadius,
    }),
    fill,
    stroke, text
  })

}



const context = function (mapBrowserEvent) {
  return mapBrowserEvent.type == "contextmenu";
}




// styling items
const styleCache = [];
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





const PreviewPopup = ({ setPopup, previewPoint }) => {
  const p = previewPoint[0]
  var hasImage = previewPoint.length > 0 && p.thumb_src
  return (<div ref={setPopup} className='preview-popup  flex place-content-center'>
    {hasImage ?
      <div className="  place-content-center flex "  >
        <section className="relative">
          {p?.images.length > 1 ? <div className=" absolute invert top-2 left-3" >{p.images.length - 1}+</div> : null}
          <img src={hasImage} alt="" />
        </section>
      </div>
      : null}
    <div className="flex place-content-center">{previewPoint.length > 0 ? <div className="w-40">{p?.name}</div> : null}</div>

    {/* previewPoint.images */}
  </div>)
}


const ContextPopup = ({ setContextMenu, contextMenuLocation, newLocationHook }) =>
  <div ref={setContextMenu} className='contextmenu-popup'>
    <button onClick={() => newLocationHook({ coordinates: contextMenuLocation })}>Add Location</button>
  </div>


const PointGroup = ({ points }) => <olSourceVector >
  {points.map(p => <olFeature key={p.coordinates.join()}  >
    <olGeomPoint coordinates={p.coordinates} />
  </olFeature>)}
</olSourceVector>



const ConvexHull = ({ points }) => {

  var p = featureCollection(
    //   [
    //   point([0, 0]),
    //   point([1000000, 0]),
    //   point([0, 1000000]),
    //   point([0, 0]),
    // ]
    points.map(p => point(p.coordinates))
  );

  if (points.length < 3) return null
  var options = { units: 'miles', maxEdge: 0.0001 };



  var { geometry: { coordinates } } = concave(p, options);
  // point



  return (
    <olSourceVector features={[]} >
      <olFeature>
        <olGeomPolygon
          args={[
            coordinates
            // [
            //   [
            //     [0, 0],
            //     [1000000, 0],
            //     [0, 1000000],
            //     [0, 0],
            //   ],
            // ],
          ]}
        />
      </olFeature>
    </olSourceVector>
  )
}

export const MapView = ({ points, setSelectedPoints, newLocationHook, addPointDialogOpen, user, className, }) => {

  // map definer
  const [map, setMap] = useState(null);

  const voronoi = useRef(null)

  // console.log(map && map.getView().getZoom());

  // popup preview stuff
  const [previewPoint, setPreviewPoint] = useState([]);
  const [popup, setPopup] = useState(null);

  // context menu stuff
  const [contextMenu, setContextMenu] = useState(null);
  const [contextMenuLocation, setContextMenuLocation] = useState(null);

  const [POIPlacementArray, updatePOIPlacementArray] = useState([]);



  // closes the context menu when the add point dialog is closed
  useEffect(() => {
    if (!addPointDialogOpen) setContextMenuLocation(null)
  }, [addPointDialogOpen])


  useEffect(() => {
    if (!user) setContextMenuLocation(null)
  }, [contextMenuLocation])



  // controllers for the context menu
  useEffect(() => {
    if (!map) return
    // right click menu needs to use an event listener
    map.on('contextmenu', function (e) {
      e.preventDefault();
      (new URLSearchParams(location.search).get('edit')) ? newLocationHook({ coordinates: e.coordinate }) : setContextMenuLocation(e.coordinate)
      // if url bar has param "fast" then console log xxx




    });
    // makes the popup go away
    map.on('click', function (e) {
      setContextMenuLocation(null)
    });



  }, [map])





  const handleMove = useCallback((e) => {
    var hovered = e.target.getFeatures().getArray().map(select =>
      points.find(({ coordinates }) =>
        coordinates.join() == select.getGeometry().getCoordinates().join()))
    setPreviewPoint(hovered.filter(s => s))
  }, [points]);


  const handleClick = useCallback((e) => {
    var selected = e.target.getFeatures().getArray().map(select =>
      points.find(({ coordinates }) =>
        coordinates.join() == select.getGeometry().getCoordinates().join()))
      .filter(s => s)
    setSelectedPoints(selected)



  }, [points]);



  // console.log(JSON.stringify(points));


  return (
    <>
      <div className={className}>
        {/* hidden popup waiting for usafe */}
        <div className="hidden-popup-container" >
          <PreviewPopup setPopup={setPopup} previewPoint={previewPoint} />
          <ContextPopup setContextMenu={setContextMenu} contextMenuLocation={contextMenuLocation} newLocationHook={newLocationHook} />
        </div>





        {/* the map */}
        <Map ref={setMap}
          style={{ width: "100%", height: "100vh" }}
        // [ADD POINT MODE]
        // onSingleclick={onMapClick}



        >

          {/* the map popup */}
          {previewPoint.length > 0 && previewPoint[0]?.coordinates ? (
            <olOverlay
              element={popup}
              position={previewPoint[0].coordinates}
              positioning={'bottom-center'}
              offset={[0, -12]}
            />
          ) : null}



          {/* context menu */}

          {contextMenuLocation ? (
            <olOverlay
              element={contextMenu}
              position={contextMenuLocation}
              positioning={'bottom-center'}
              offset={[0, -12]}
            />
          ) : null}


          {/* controls */}
          {/* <olControlOverviewMap layers={[]} /> */}
          {/* <olControlRotate /> */}
          <olControlFullScreen />
          {/* <olControlScaleLine render={console.log} /> */}

          {/* view */}
          <olView initialCenter={[-3247495.2505356777, 4704319.403427397]} initialZoom={6}
            constrainResolution={true}
            enableRotation={false}
            maxZoom={14}
          />

          {/* layers */}
          {WarhammerMainMap}
          {MarienburgMap}
          {AltdorfMap}
          {BelAliad}
          {Carroburg}
          {Kemperbad}
          {Miragliano}
          {Nuln}
          {Praag}
          {Sartosa}
          {Ubersreik}

          {/* points */}
          {/* used for placing POIs */}
          {/* <olLayerVector style={e => {
            let i = POIPlacementArray.findIndex(coord => coord.join() == e.getGeometry().getCoordinates().join())
            if (!i && i != 0) return
            let s = styleBuilder({ strokeColor: 'red', txt: i.toString() })
            return s
          }}>
            <olSourceVector >
              {POIPlacementArray.map((coordinate, i) => <olFeature key={i}  >
                <olGeomPoint coordinates={coordinate} />
              </olFeature>)}
            </olSourceVector>
          </olLayerVector> */}


          {/* <olLayerVector style={(e, a, c) => { console.log(e, a, c); return styleBuilder({ txt: "HELLO", strokeColor: 'yellow', strokeWidth: 2, circleRadius: isMobile ? 8 : 5 }) }}> */}

          <olLayerVector style={(feature, zoom) => styleBuilder({ strokeColor: 'yellow', strokeWidth: 2, circleRadius: isMobile ? 8 : 5 })}>
            <PointGroup points={points.filter(p => p.public).filter(p => !p.images || p.images?.length == 0)} />
          </olLayerVector>


          <olLayerVector style={(feature, zoom) => styleBuilder({ strokeColor: 'blue', strokeWidth: 2, circleRadius: isMobile ? 8 : 5 })}>
            <PointGroup points={points.filter(p => p.public).filter(p => p.images?.length > 0)} />
          </olLayerVector>

          {/* <olLayerVector style={(feature, zoom) => styleBuilder({ strokeColor: 'orange' })}>
            <ConvexHull points={points.filter(p => !p.public)} />
          </olLayerVector> */}

          {(new URLSearchParams(location.search).get('voronoi')) ?
            <VoronoiCells ref={voronoi} smooth={new URLSearchParams(location.search).get('smooth')} points={points.filter(p => !p.public)} /> : null

          }

          {(new URLSearchParams(location.search).get('delaunay')) ?
            <DelaunayCells points={points.filter(p => !p.public)} /> : null

          }

          <olLayerVector zIndex={2} style={(feature, zoom) => styleBuilder({ strokeColor: 'red' })}>
            <PointGroup points={points.filter(p => !p.public)} />
          </olLayerVector>





          <olInteractionSelect
            args={{ condition: click }}
            // style={selectedStyleFunction}
            onSelect={handleClick}
          />

          {isMobile ? null : <olInteractionSelect
            args={{ condition: pointerMove }}
            // style={selectedStyleFunction}
            onSelect={handleMove}
          />}





        </Map>
      </div>
    </>
  )
};



