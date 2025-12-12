<script lang="ts">
  import { onMount } from "svelte";
  import { MapLibre } from "svelte-maplibre";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";

  let locations = {};
  onMount(async () => {});
</script>

<Search></Search>
<nav class="bottom right">
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content"></div>
  </Dialog>
</nav>
<MapLibre
  center={[-0.118092, 51.509865]}
  zoom={3}
  class="map"
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
></MapLibre>

<style>
  :global(.map) {
    height: 100%;
    width: 100%;
  }
</style>
