<script>
  import { addLocation, locations } from "./locations";
  import { addRoute, routes, toggleRoutes } from "./routes";
  import {
    addId,
    addLocationTags,
    isAddMode,
    localLocations,
    localRoutes,
    map,
  } from "./stores";

  console.log("isAddMode", isAddMode);

  toggleRoutes(true);

  let addOpen = false;

  // let tags = "country:brettonia";
  let lastLocation;
  let coordinates;
  let newLocationName;
  let connectRoute = true;

  map.subscribe((map) => {
    if (!map) return;
    // for adding new locations
    map.getViewport().addEventListener("contextmenu", (e) => {
      console.log("menu");
      e.preventDefault();
      const pixel = map.getEventPixel(e);
      const c = map.getCoordinateFromPixel(pixel);
      console.log(c);
      coordinates = c;
      addOpen = true;
    });
  });

  function handleSubmit() {
    console.log("sub");
    let requiredTags = ["source:quickadd", "added_by:" + addId];

    let location = {
      name: newLocationName,
      coordinates,
      tags: [...requiredTags, ...($addLocationTags?.split(",") || [])],
      credit: addId,
    };

    let newLocation = addLocation(location);
    if (connectRoute && lastLocation) {
      let route = {
        source_id: newLocation.id,
        destination_id: lastLocation.id,
      };
      console.log(route);

      let newRoute = addRoute({
        source_id: newLocation.id,
        destination_id: lastLocation.id,
      });
      $localRoutes = [...$localRoutes, newRoute];
    }
    lastLocation = newLocation;

    $localLocations = [...$localLocations, newLocation];

    coordinates = null;
    newLocationName = "";
    console.log(locations, routes);
  }

  function focus(node) {
    queueMicrotask(() => node.focus());
  }

  function downloadJSON(obj, filename = "data.json") {
    const blob = new Blob([JSON.stringify(obj, null, "\t")], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  }
</script>

{#if isAddMode}
  <main>
    Add mode enabled
    {#if addOpen}
      {#key coordinates}
        <input
          placeholder="enter location name"
          autofocus
          use:focus
          on:keydown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          type="text"
          bind:value={newLocationName}
        />
      {/key}
      <div><i>{coordinates}</i></div>
      <input
        placeholder="tags seperated by commas"
        type="text"
        bind:value={$addLocationTags}
      />
      <div>
        <label for="">
          Auto add path to last location ({lastLocation?.name || "none"})
          <input bind:checked={connectRoute} type="checkbox" />
        </label>
      </div>
    {/if}
    <div class="flex">
      <button
        on:click={() => downloadJSON($localRoutes, addId + "_routes.json")}
        >Download ({$localRoutes.length}) new routes
      </button>
      <button
        on:click={() =>
          downloadJSON($localLocations, addId + "_locations.json")}
        >Download ({$localLocations.length}) new locations
      </button>
    </div>
  </main>
{/if}

<style>
  main {
    width: calc(100% - 40px);
    max-width: 400px;
    border: 2px solid black;
    border-radius: 5px;
    padding: 10px;
    background-color: grey;
  }
</style>
