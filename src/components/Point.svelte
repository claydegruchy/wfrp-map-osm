<script>
  // add a map point with openlayers, dont reference ol. directly, import modules

  // import openlayers
  import Feature from "ol/Feature";
  import Point from "ol/geom/Point";
  import Vector from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";

  import { sceneStyleGenerator } from "$lib/olStyleBuilder.js";
  import { Stroke, Style } from "ol/style";

  import { getContext, onMount } from "svelte";
  const { getMapInstance } = getContext("mapSharedState");
  const mapInstance = getMapInstance();

  export let point;
  export let type;
  export let layer;

  let pointFeature = new Feature({
    ...point,
    geometry: new Point(point.coordinates),
  });

  layer.getSource().addFeature(pointFeature);



  console.log("[Point] initated", type, layer.ol_uid);
</script>
