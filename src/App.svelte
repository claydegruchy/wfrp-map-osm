<script lang="ts">
  import { onMount } from "svelte";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";
  import Map from "./lib/Map.svelte";

  import SelectedLocation from "./lib/SelectedLocation.svelte";
  import Diagnostics from "./lib/Diagnostics.svelte";
  import { locations, locationsObject } from "./lib/locations";
  import { selectedLocations } from "./lib/stores";

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
  locationsObject;
</script>

<Search lookUpName={findLocation} returnSelection={selectSearchResult}></Search>
<nav class="bottom right flex">
  <!-- <Diagnostics></Diagnostics> -->
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content"></div>
  </Dialog>
</nav>

<Map {locationSelected} bind:selectLocationById bind:zoomToLocationById></Map>

<nav class="bottom left">
  {#if $selectedLocations.length > 0}
    <SelectedLocation
      locations={$selectedLocations.map((id) => locationsObject[id])}
    ></SelectedLocation>
  {/if}
</nav>

<style>
  :global(.map) {
    height: 100%;
    width: 100%;
  }


</style>
