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
  import HelpText from "./lib/HelpText.svelte";

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

<nav class="bottom gutter">
  <div class="selected">
    {#if $selectedLocations.length > 0}
      <SelectedLocation
        locations={$selectedLocations.map((id) => locationsObject[id])}
      ></SelectedLocation>
    {/if}
  </div>
  <div class="flex vertical buttons">
    <button on:click={toggleCountries}>Countries</button>
    <button on:click={toggleStates}>States</button>
    <button on:click={toggleRoutes}>Routes</button>
    <!-- <Diagnostics></Diagnostics> -->
    <Dialog>
      <div slot="button">?</div>
      <div slot="content"><HelpText></HelpText></div>
    </Dialog>
  </div>
</nav>

<Map bind:selectLocationById bind:zoomToLocationById bind:zoomToEncompass></Map>

<nav class="bottom left"></nav>

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

  nav {
    width: calc(100% - 10px); /* full width minus 10px gap each side */
    left: 5px; /* left gap */
    right: 5px; /* right gap */
  }
  .gutter {
    display: flex;
    align-items: flex-end; /* keeps both at the bottom */
    justify-content: flex-end; /* pushes buttons to the right */
    gap: 10px; /* optional space between selected and buttons */
    pointer-events: none;
  }

  .selected {
    pointer-events: all;

    flex: 1; /* takes remaining space next to buttons */
    margin-top: 0; /* remove auto so it aligns at bottom */
  }

  .buttons {
    pointer-events: all;

    width: 30%; /* stays on the right */
  }
</style>
