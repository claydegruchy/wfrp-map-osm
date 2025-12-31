<script>
  import { addLocation, locations } from "./locations";
  import { addRoute, routes, toggleRoutes } from "./routes";
  import { addId, isAddMode, map } from "./stores";

  console.log("isAddMode", isAddMode);

  toggleRoutes();

  let addOpen = false;

  let tags = "country:brettonia";
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
      tags: [...requiredTags, ...(tags?.split(",") || [])],
      credit: addId,
    };

    let newLocation = addLocation(location);
    if (connectRoute && lastLocation) {
      let route = {
        source_id: newLocation.id,
        destination_id: lastLocation.id,
      };
      console.log(route);

      addRoute({ source_id: newLocation.id, destination_id: lastLocation.id });
    }
    lastLocation = newLocation;
    console.log(locations, routes);

    coordinates = null;
    newLocationName = "";
  }
  let input;

  function focus(node) {
    queueMicrotask(() => node.focus());
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
          bind:this={input}
          bind:value={newLocationName}
        />
      {/key}
      <div><i>{coordinates}</i></div>
      <input
        placeholder="tags seperated by commas"
        type="text"
        bind:value={tags}
      />
      <div>
        <label for="">
          Auto add path to last location ({lastLocation?.name||"none"})
          <input bind:checked={connectRoute} type="checkbox" />
        </label>
      </div>
    {/if}
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
