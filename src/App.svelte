<script lang="ts">
  import { onMount } from "svelte";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";
  import Map from "./lib/Map.svelte";

  import SelectedLocation from "./lib/SelectedLocation.svelte";
  import Diagnostics from "./lib/Diagnostics.svelte";
  import {
    locations,
    locationsObject,
    selectLocationById,
    zoomToLocationById,
  } from "./lib/locations";
  import {
    isDev,
    localLocations,
    localLocationsObjectNonStore,
    pathFinderDestination,
    pathFinderOrigin,
    riverMode,
    roadMode,
    seaMode,
    selectedLocations,
    selectedPathIndex,
    speedMethodMap,
    speeds,
    underwayMode,
  } from "./lib/stores";
  import { toggleCountries, toggleStates } from "./lib/boundryDrawing";
  import {
    findPaths,
    pathSources,
    setPath,
    setPaths,
    toggleRoutesDisplay,
    zoomToEncompass,
  } from "./lib/routes";
  import PathDisplay from "./lib/PathDisplay.svelte";
  import HelpText from "./lib/HelpText.svelte";
  import EditMode from "./lib/EditMode.svelte";
  import PathSelector from "./lib/PathSelector.svelte";

  let paths = [];

  function findLocation(value) {
    let filtered = Object.values(locationsObject)
      .filter((e) => e.enabled != false)
      .filter(
        (loc) =>
          loc?.name?.length > 0 &&
          (loc.name.toLowerCase().includes(value.toLowerCase()) ||
            (loc.tags &&
              loc.tags.join(" ").toLowerCase().includes(value.toLowerCase())))
      )
      .sort((a, b) => {
        const valLower = value.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aStarts = aName.startsWith(valLower) ? 0 : 1;
        const bStarts = bName.startsWith(valLower) ? 0 : 1;

        return aStarts - bStarts; // items starting with value come first
      })
      .slice(0, 10);

    console.log(filtered);
    return filtered;
  }

  function selectSearchResult(id) {
    selectLocationById(id);
    zoomToLocationById(id);
    $pathFinderOrigin = id;
  }

  function updatePathFinder() {
    // { pathNodes, pathRouteIds, pathRouteTags, cost: bestDist }
    paths = findPaths(
      $pathFinderOrigin,
      $pathFinderDestination,
      {
        road: $roadMode,
        river: $riverMode,
        sea: $seaMode,
        underway: $underwayMode,
      },
      speeds
    );
  }

  function updatePathDisplay(paths) {
    pathSources.forEach((discard, i) => {
      if (paths[i]) setPaths(i, i == $selectedPathIndex, paths[i]);
    });
  }

  function startPathFinder(id) {
    $pathFinderDestination = id;
    updatePathFinder();
    updatePathDisplay(paths);
    if (paths.length > 0) $selectedPathIndex = 0;
    zoomToEncompass(paths[$selectedPathIndex]);
  }

  function clearPath() {
    paths = [];
    $pathFinderDestination = null;
    $pathFinderOrigin = null;
    $selectedPathIndex = -1;
    updatePathDisplay(paths);
  }

  onMount(() => {
    isDev &&
      setTimeout(() => {
        selectSearchResult("a6jaSzZq6Fnd");
        startPathFinder("UlGQ5WaiQHpVvJp5QrN7");
      }, 1);

    for (const [name, store] of Object.entries(speedMethodMap)) {
      store.subscribe((val) => {
        console.log(name, "changed", val);

        if (paths.length > 0 && $pathFinderOrigin && $pathFinderDestination) {
          updatePathFinder();
          updatePathDisplay(paths);
        }
      });
    }

    updatePathFinder;
  });
</script>

<nav class="top left search flex vertical">
  <Search lookUpName={findLocation} returnSelection={selectSearchResult} />
  {#if $pathFinderOrigin}
    <Search
      placeholder={"Find a route..."}
      lookUpName={findLocation}
      returnSelection={startPathFinder}
    />
  {:else}{/if}

  {#key paths}
    {#if paths.length > 0}
      <PathSelector {clearPath} {paths} />
    {/if}
  {/key}
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
    <Diagnostics></Diagnostics>
    <EditMode></EditMode>
    <button on:click={toggleCountries}>Countries</button>
    <button on:click={toggleStates}>States</button>
    <button on:click={toggleRoutesDisplay}>Routes</button>
    <Dialog>
      <div slot="button">?</div>
      <div slot="content"><HelpText></HelpText></div>
    </Dialog>
  </div>
</nav>

<Map></Map>

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
    justify-content: space-between; /* pushes buttons to the right */
    gap: 10px; /* optional space between selected and buttons */
    pointer-events: none;
  }

  .selected {
    pointer-events: all;
    max-width: 500px;

    flex: 1; /* takes remaining space next to buttons */
    margin-top: 0; /* remove auto so it aligns at bottom */
  }

  .buttons {
    pointer-events: all;

    max-width: 30%; /* stays on the right */
  }

  .buttons > button {
    padding: 2px;
  }
</style>
