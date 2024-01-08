import React from "react";
import { styleBuilder } from "../MapView";
import { LineString, Point } from 'ol/geom';
import { Stroke, Style } from 'ol/style';

import GeoJSON from "ol/format/GeoJSON";

import { Delaunay } from 'd3-delaunay';
import { useEffect } from "react";

export function DelaunayCells({ points }) {


  const [lines, setLines] = React.useState([])




  function p(...args) { console.log(...args) }

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


  // get the first 30 points
  const firstCoords = points
    .filter(p => !p.name.includes(" "))
    .map(p => p.coordinates)
    // .slice(0, 30)
    .flat()


  const d = new Delaunay(firstCoords);



  useEffect(e => {
    p("running full delaunay update")
    Promise.all(d.trianglePolygons())
      .then((triangles) => {
        const l = []
        const g = []

        for (const triangle of triangles) {
          for (let i = 0; i < 3; i++) {
            let a = triangle[i]
            let b = triangle[(i + 1) % 3]

            const dis = Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);

            g.push(dis)
            if (dis > 872217) continue

            l.push([a, b])
          }
        }
        p({ g: g.sort((a, b) => a - b) })

        setLines(l)

      })
  }, [points])


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
    <olLayerVector style={(feature, zoom) => styleBuilder({
      strokeColor: 'rgba(125, 0, 0, 0.8)',
      fillColor: 'rgba(0, 0, 0, 0.8)',
      strokeWidth: 5
    })} >
      <olSourceVector features={new GeoJSON().readFeatures(geos)}>
      </olSourceVector>
    </olLayerVector >


  );

}
