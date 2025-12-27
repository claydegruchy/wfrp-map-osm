<script lang="ts">
  import { onMount } from "svelte";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";
  import Map from "./lib/Map.svelte";
  import { locations } from "./lib/locations";

  let selected;
  let selectLocationById;
  let zoomToLocationById;

  function locationSelected(s) {
    selected = s;
  }

  function findLocation(value) {
    console.log("findLocation", value, locations);
    const filtered = locations
      .filter(
        (loc) =>
          loc.name.toLowerCase().includes(value.toLowerCase()) ||
          (loc.tags &&
            loc.tags.join(" ").toLowerCase().includes(value.toLowerCase()))
      )
      .slice(0, 10);
    console.log(filtered);

    return filtered;
  }

  function selectSearchResult(id) {
    selectLocationById(id);
    zoomToLocationById(id);
  }
</script>

<Search lookUpName={findLocation} returnSelection={selectSearchResult}></Search>
<nav class="bottom right">
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content"></div>
  </Dialog>
</nav>

<Map {locationSelected} bind:selectLocationById bind:zoomToLocationById></Map>

{#if selected}
  <nav class="bottom left">
    {selected.name}
  </nav>
{/if}

<style>
  :global(.map) {
    height: 100%;
    width: 100%;
  }
</style>
