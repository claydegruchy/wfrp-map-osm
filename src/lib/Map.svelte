<script lang="ts">
  import { transform } from "ol/proj";
  import { Map, Layer } from "svelte-openlayers";
  import WarhammerMaps from "./WarhammerMaps.svelte";

  let mapCenter = $state([0, 0]);
  let mapZoom = $state(2);
</script>

<div id="map">
  <Map.Root>
    <Map.View bind:center={mapCenter} bind:zoom={mapZoom} />
    <!-- <Layer.Tile source="osm" /> -->
    <WarhammerMaps />
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
