<script>
  // add a map point with openlayers, dont reference ol. directly, import modules

  // import openlayers
  import Feature from "ol/Feature";
  import Point from "ol/geom/Point";

//   import { getContext } from "svelte";
//   const { getMapInstance, getMapUrl } = getContext("mapSharedState");

  const point = new Feature({
    geometry: new Point([0, 0]),
  });

  console.log("point", point);
</script>
