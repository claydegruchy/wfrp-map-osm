import React from "react";
import { styleBuilder } from "../MapView";
import { LineString, Point } from 'ol/geom';
import { Stroke, Style } from 'ol/style';

import GeoJSON from "ol/format/GeoJSON";

import { GetPoint } from '../firebase'


export function DelaunayCells({ lines }) {


  let geos = {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "EPSG:3857",
      },
    },
    features: []
  }


  lines.forEach(coords => {
    geos.features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coords
      }
    })
  })



  if (lines.length < 1) return null


  return (




    <olSourceVector features={new GeoJSON().readFeatures(geos)}>
    </olSourceVector>




  );

}
