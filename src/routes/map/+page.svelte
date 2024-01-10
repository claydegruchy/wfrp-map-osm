<script>
  import { onMount } from "svelte";

  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";

  let map;
  let mapContainer;

  onMount(() => {
    console.log("mounted");
    map = new maplibregl.Map({
      container: "map", // container id
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [
              // NOTE: Layers from Stadia Maps do not require an API key for localhost development or most production
              // web deployments. See https://docs.stadiamaps.com/authentication/ for details.
              "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
            ],
            tileSize: 256,
            attribution:
              'Map tiles by <a target="_blank" href="http://stamen.com">Stamen Design</a>; Hosting by <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>. Data &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [-74.5, 40], // starting position
      zoom: 2, // starting zoom
    });
  });
</script>

<div
  class="map absolute bottom-0 top-0 right-0 left-0 page"
  id="map"
  bind:this={mapContainer}
></div>
