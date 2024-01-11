<script>
  import Vector from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import { olStyleBuilder } from "$lib/olStyleBuilder.js";

  import { getMapInstance } from "$lib/utilities.js";
  const mapInstance = getMapInstance();

  export let type;

  const layer = new Vector({
    style: olStyleBuilder({
      strokeColor: type == "public" ? "red" : "orange",
    }),
    source: new VectorSource({
      features: [],
    }),
  });

  mapInstance.addLayer(layer);

  console.log("[GenericLayer] initated", type);
</script>

<slot {layer} />
