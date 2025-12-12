<script>
  import { MapLibre, RasterLayer, RasterTileSource } from "svelte-maplibre";
</script>

<MapLibre
  center={[-0.118092, 51.509865]}
  zoom={3}
  minZoom={1}
  maxZoom={14}
  class="map"
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
>
  <RasterTileSource
    tiles={[
      "https://claydegruchy.github.io/wfrp-map-storage/world-map/{z}/{z}_{x}_{y}.jpg",
    ]}
    tileSize={256}
    maxzoom={7}
  >
    <RasterLayer paint={{}} />
  </RasterTileSource>
</MapLibre>

<style>
  :global(.map) {
    height: 100%;
    width: 100%;
  }
</style>
