<script>
  import {
    DefaultMarker,
    MapLibre,
    Marker,
    Popup,
    RasterLayer,
    RasterTileSource,
  } from "svelte-maplibre";

  export let locations;
  export function zoomTo(name) {
    console.log("zoom to", name);
  }


</script>

<MapLibre
  center={[1, 1]}
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
    <RasterLayer
      paint={{
        "raster-opacity": 0.5,
      }}
    />
  </RasterTileSource>

  {#each locations as { lngLat, name, tags }}
    {#if tags}
      <Marker {lngLat}>
        <span class={`marker ` + tags.join(" ")}> </span>
      </Marker>
    {:else}
      <Marker {lngLat}>
        <span class={`marker `}>{name} </span>
      </Marker>
    {/if}
  {/each}
</MapLibre>

<style>
  :global(.map) {
    height: 100%;
    width: 100%;
  }
  .marker {
    width: 10px;
    height: 10px;
    min-width: 10px;
    min-height: 10px;

    border-radius: 50%;
    background: transparent;
    border: 2px solid blue;

    box-sizing: border-box;
    display: block;
  }

  .marker.blue {
    border: 2px solid blue;
  }

  .marker.city {
    border: 2px solid red;
  }

  .marker.empire {
    border: 2px solid green;
  }
</style>
