<script>
  // add a map point with openlayers, dont reference ol. directly, import modules

  // import openlayers
  import Feature from "ol/Feature";
  import Point from "ol/geom/Point";
  import Vector from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";

  import { olStyleBuilder } from "$lib/olStyleBuilder.js";

  import { getContext } from "svelte";
  const { getMapInstance } = getContext("mapSharedState");
  const mapInstance = getMapInstance();

  export let point;

  const pointFeature = new Feature({
    ...point,
    geometry: new Point(point.coordinates),
  });

  mapInstance.addLayer(
    new Vector({
      style: olStyleBuilder({ strokeColor: "red" }),
      source: new VectorSource({
        features: [pointFeature],
      }),
    })
  );
</script>
