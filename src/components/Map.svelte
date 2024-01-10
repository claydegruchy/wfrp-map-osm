<script>
  import { onMount, setContext } from "svelte";
  import MapLayer from "./MapLayer.svelte";

  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";

  setContext("mapSharedState", {
    getMapInstance: () => mapInstance,
    getMapUrl: () => "https://claydegruchy.github.io/wfrp-map-storage",
  });

  let mapInstance;
  let mapContainer;

  onMount(() => {
    const initialState = { lng: -16.884488645726726, lat: 31.7800177883011, zoom: 6 };

    mapInstance = new maplibregl.Map({
      container: mapContainer, // container id
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    mapInstance.on("load", function () {
      mapInstance.resize();
    });
  });
</script>

<div id="map" bind:this={mapContainer}>
  {#if mapInstance}
    <slot />
  {/if}
</div>

<style>
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
</style>
