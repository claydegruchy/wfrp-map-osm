<script>
  import { onMount } from "svelte";
  import Map from "ol/Map.js";
  import View from "ol/View.js";
  import TileLayer from "ol/layer/Tile.js";
  import OSM from "ol/source/OSM.js";
  import { TileImage, XYZ } from "ol/source";
  import { map } from "./stores";
  import "ol/ol.css";
  import { TileGrid } from "ol/tilegrid";

  let center = [-3247495.2505356777, 4704319.403427397];
  let zoom = 5;

  const imageStorageURL = "https://claydegruchy.github.io/wfrp-map-storage";
  const mainMapUrl = imageStorageURL + "/world-map/{z}/{z}_{x}_{y}.jpg";

  const marienburgTileGrid = new TileGrid({
    extent: [
      -3320017.90883266041, 4701281.93297282793, -3175634.72078718198,
      4803354.42623188905,
    ],
    origin: [-3320017.90883266041, 4701281.93297282793],
    resolutions: [
      658.5322145745888, 329.2661072872944, 164.6330536436472, 82.3165268218236,
      41.1582634109118, 20.5791317054559, 10.28956585272795, 5.144782926363975,
    ],
    tileSize: [256, 256],
  });

  onMount(() => {
    $map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: mainMapUrl,
            maxZoom: 7,
          }),
        }),

        new TileLayer({
          preload: 3,
          source: new XYZ({
            tileGrid: marienburgTileGrid,
            tileUrlFunction: (tileCoord) => {
              const [z, x, y] = tileCoord;
              let url =
                imageStorageURL +
                "/" +
                "marienburg/" +
                z +
                "/" +
                x +
                "/" +
                (-1 - y) +
                ".png";
              console.log(url);

              return url;
            },
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
