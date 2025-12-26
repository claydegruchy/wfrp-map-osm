<script lang="ts">
  import { transform } from "ol/proj";
  import { Map, Layer } from "svelte-openlayers";

  let mapCenter = $state([0, 0]);
  let mapZoom = $state(2);

  const transformedCoordinates = $derived(
    transform(mapCenter, "EPSG:3857", "EPSG:4326")
  );
</script>

<div id="map">
  <Map.Root class="map-root">
    <Map.View bind:center={mapCenter} bind:zoom={mapZoom} />
    <Layer.Tile source="osm" />
  </Map.Root>
</div>

<style>
  #map {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
