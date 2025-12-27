<script>
  import { onMount } from "svelte";
  import Map from "ol/Map.js";
  import View from "ol/View.js";
  import TileLayer from "ol/layer/Tile.js";
  import OSM from "ol/source/OSM.js";
  import { XYZ } from "ol/source";
  import { map } from "./stores";

  let center = [-3247495.2505356777, 4704319.403427397];
  let zoom = 5;

  const imageStorageURL = "https://claydegruchy.github.io/wfrp-map-storage";
  const mainMapUrl = imageStorageURL + "/world-map/{z}/{z}_{x}_{y}.jpg";

  onMount(() => {
    $map = new Map({
      target: "map",
      layers: [
        new TileLayer({ source: new OSM() }),
        new TileLayer({
          source: new XYZ({
            url: mainMapUrl,
            maxZoom: 7,
          }),
        }),
      ],
      view: new View({ center, zoom }),
    });
  });

  $: if ($map) {
    $map.getView().setCenter(center);
    $map.getView().setZoom(zoom);
  }
</script>

<div id="map"></div>

<style>
  #map {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
