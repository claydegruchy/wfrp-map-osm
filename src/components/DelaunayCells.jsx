import React from "react";
import { styleBuilder } from "../MapView";
import { LineString, Point } from 'ol/geom';

import GeoJSON from "ol/format/GeoJSON";


export function DelaunayCells({ }) {

  var lonlat = [33.8, 8.4];
  var location2 = [37.5, 8.0];


  const x = new LineString([lonlat, location2])

  console.log(x);

  const geojsonObject = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [4e6, 2e6],
        [8e6, -2e6],
      ],
    },
  }





  return (
    <olLayerVector style={(feature, zoom) => styleBuilder({
      strokeColor: 'rgba(125, 0, 0, 0.8)',
      fillColor: 'rgba(0, 0, 0, 0.8)'
    })} >



      <olSourceVector features={new GeoJSON().readFeatures(geojsonObject)}>

      </olSourceVector>


    </olLayerVector>


  );

}
