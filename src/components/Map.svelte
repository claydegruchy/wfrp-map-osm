<script>
  import { onMount, setContext } from "svelte";
  import "ol/ol.css";

  // import openlayers

  import Map from "ol/Map";
  import View from "ol/View";

  setContext("mapSharedState", {
    getMapInstance: () => mapInstance,
    getMapUrl: () => "https://claydegruchy.github.io/wfrp-map-storage",
  });

  let mapInstance;
  let mapContainer;

  onMount(() => {
    const initialState = {
      center: [-1879572.67834710842, 3734469.05619834783],
      zoom: 6,
    };

    mapInstance = new Map({
      target: mapContainer,
      layers: [],
      view: new View({
        center: [0, 0],
        zoom: 2,
        ...initialState,
      }),
    });

    // for some reason, the map doesnt get if you have tabindex
    mapInstance.on("loadend", function () {
      mapContainer.focus();
    });
  });
</script>

<!-- 
  enable this to allow key scrolling at the coost of having to click on the map to use it
   -->

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div id="map" tabindex="0" bind:this={mapContainer}>
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
