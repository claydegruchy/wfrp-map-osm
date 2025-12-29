<script lang="ts">
  import { onMount } from "svelte";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";
  import Map from "./lib/Map.svelte";

  import SelectedLocation from "./lib/SelectedLocation.svelte";
  import Diagnostics from "./lib/Diagnostics.svelte";
  import { locations, locationsObject } from "./lib/locations";
  import { selectedLocations } from "./lib/stores";
  import { toggleCountries, toggleStates } from "./lib/boundryDrawing";
  import { findPath, setPath, toggleRoutes } from "./lib/routes";
  import PathDisplay from "./lib/PathDisplay.svelte";

  let pathFinderOrigin;
  let pathFinderDestination;
  let path;

  let selectLocationById;
  let zoomToLocationById;
  let zoomToEncompass;

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
    pathFinderOrigin = id;
  }

  function startPathFinder(id) {
    pathFinderDestination = id;
    path = findPath(pathFinderOrigin, pathFinderDestination);
    setPath(path);
    zoomToEncompass(path);
  }

  function clearPath() {
    path = null;
    pathFinderDestination = null;
    pathFinderOrigin = null;
    setPath({ pathRouteIds: [] });
  }

  onMount(() =>
    setTimeout(() => {
      selectSearchResult("cL30w9UailtiheDMkqTR");
      startPathFinder("UlGQ5WaiQHpVvJp5QrN7");
    }, 1)
  );
</script>

<nav class="top left search flex vertical">
  <Search lookUpName={findLocation} returnSelection={selectSearchResult} />
  {#if pathFinderOrigin}
    <Search
      placeholder={"Find a route..."}
      lookUpName={findLocation}
      returnSelection={startPathFinder}
    />
  {/if}

  {#if pathFinderOrigin && pathFinderDestination}
    <PathDisplay
      {clearPath}
      {pathFinderOrigin}
      {pathFinderDestination}
      bind:path
    ></PathDisplay>
  {/if}
</nav>

<nav class="bottom right flex">
  <button on:click={() => zoomToEncompass(path)}>test</button>
  <button on:click={toggleCountries}>Toggle Countries</button>
  <button on:click={toggleStates}>Toggle States</button>
  <button on:click={toggleRoutes}>Toggle Routes</button>
  <!-- <Diagnostics></Diagnostics> -->
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content"></div>
  </Dialog>
</nav>

<Map bind:selectLocationById bind:zoomToLocationById bind:zoomToEncompass></Map>

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

  .search {
    width: calc(100% - 40px);
    max-width: 400px;
    margin: 0 20px;
  }
</style>
