<script>
  import Vector from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import VectorLayer from "ol/layer/Vector.js";
  import { Stroke, Style } from "ol/style";

  import { olStyleBuilder, sceneStyleGenerator } from "$lib/olStyleBuilder.js";

  import { getContext, onMount } from "svelte";
  const { getMapInstance } = getContext("mapSharedState");
  // return getMapInstance();
  const mapInstance = getMapInstance();

  export let type;
  export let layer;
  export let styleGenerator;

  // Create a new style object for each feature
  // feature, zoom
  layer = new Vector({
    name: type,
    source: new VectorSource({
      features: [],
    }),
  });
  layer.setStyle(styleGenerator);
  mapInstance.addLayer(layer);

  console.log("[GenericLayer] initated", type);

  console.log(mapInstance.getLayers());
</script>

{#if layer}
  <slot {layer} />
{/if}
