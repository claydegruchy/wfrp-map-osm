import React from "react";
import voronoi from '@turf/voronoi';
import { point, featureCollection } from "@turf/helpers";
import { bbox, polygon, intersect, polygonSmooth } from '@turf/turf';
import concaveHull from 'concaveman';
import { styleBuilder } from "../MapView";

export function VoronoiCells({ points, smooth = true }) {

  var p = featureCollection(
    points.map(p => point(p.coordinates))

  );

  const bounds = bbox(p);

  if (!points || points.length < 1) return null;

  function maskMultiPolygon(multiPolygon, geometryToMask) {
    // Step 1: Split MultiPolygon into an array of Polygons
    const polygons = multiPolygon.features;

    console.log(polygons.length);

    // Step 2: Loop for each Polygon and call mask()
    const maskResults = [];
    let i = 0;
    for (const polygon of polygons) {
      let maskedGeometry = intersect(geometryToMask, polygon);
      if (smooth) {
        // maskedGeometry = simplify(maskedGeometry, { tolerance: 50000, highQuality: false })
        maskedGeometry = polygonSmooth(maskedGeometry, { iterations: 3 }).features[0];

      }
      // console.log({ maskedGeometry }, i)
      maskResults.push(maskedGeometry);
      i++;
    }
    return featureCollection(maskResults);

  }

  var voronoiPolygons = voronoi(p, { bbox: bounds });
  if (!voronoiPolygons) return null;
  let concaveHullPolygon = concaveHull(points.map(p => p.coordinates), 0.9, 600000);
  // only returns a list of coords, need to convert to a poly feature
  concaveHullPolygon = polygon([concaveHullPolygon], {});
  console.log(concaveHullPolygon);


  const masked = maskMultiPolygon(voronoiPolygons, concaveHullPolygon);


  return (
    <>
      {masked.features
        // .filter((f) => coordinates[0].length > 2)
        .map(({ geometry: { coordinates } }) => <olLayerVector key={coordinates.join()} style={(feature, zoom) => styleBuilder({
          strokeColor: 'rgba(125, 0, 0, 0.8)',
          fillColor: 'rgba(0, 0, 0, 0.8)'
        })}><olSourceVector features={[]}>

            <olFeature>
              <olGeomPolygon
                args={[
                  coordinates
                ]} />
            </olFeature>
          </olSourceVector>
        </olLayerVector>

        )}
    </>


  );

}
