<script>
  import DragBox from "ol/interaction/DragBox";
  import { locations, locationsObject } from "./locations";
  import { isEditMode, isOpMode, map, selectedLocations } from "./stores";
  import { routes, routesObject, routeSource, setRoutes } from "./routes";
  import { platformModifierKeyOnly } from "ol/events/condition";
  let newLocations = [];

  function copyLocationsToClipboard() {
    // clean locations

    newLocations = newLocations.map((l) => ({
      ...l,
      tags: [...new Set([...l.tags])],
    }));

    console.log(newLocations);

    navigator.clipboard
      .writeText(JSON.stringify(newLocations, null, 2))
      .then(() => {
        console.log("Copied:");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
    ready = false;
  }

  function startOperation() {
    for (const id of $selectedLocations) {
      let location = locationsObject[id];
      if (!location) alert("location not found" + id);
      console.log(location);
      if (!location.tags) location.tags = [];
      location.tags.push(newTag);
      locationsObject[id] = location;
    }

    newLocations = Object.values(locationsObject);
    newLocations = newLocations.map((l) => ({
      ...l,
      tags: [...new Set([...(l.tags || [])])],
    }));

    ready = true;
  }

  let dragUpdateEnabled = false;

  function platformModifierKeyOnlyLocal(params) {
    if (dragUpdateEnabled) return platformModifierKeyOnly(params);

    return false;
  }

  const dragBox = new DragBox({
    condition: platformModifierKeyOnlyLocal, // Ctrl on Windows/Linux, Cmd on macOS
  });

  function toggleDragBox() {
    if (!dragBox) return;
    dragUpdateEnabled = !dragUpdateEnabled;
    map.update((m) => {
      console.log("dragUpdateEnabled", dragUpdateEnabled);

      dragUpdateEnabled
        ? m.addInteraction(dragBox)
        : m.removeInteraction(dragBox);
      return m;
    });
  }
  map.subscribe((map) => {
    if (!map) return;

    map.addInteraction(dragBox);

    dragBox.on("boxend", () => {
      if (!dragUpdateEnabled) return;
      const extent = dragBox.getGeometry().getExtent();

      const toUpdate = [];
      routeSource.forEachFeatureIntersectingExtent(extent, (feature) => {
        toUpdate.push(feature.getId());
      });

      for (const id of toUpdate) {
        if (routesObject[id]) {
          routesObject[id].type = newRouteType;
        }
      }
      // console.log(toUpdate.length, toUpdate);

      const routes = Object.values(routesObject);
      setRoutes(routes);
      console.log(locations, routes);
    });
  });

  let ready = false;
  let newTag;

  let newRouteType = "water";
</script>

{#if isOpMode}
  <main>
    <b>Bulk operation mode</b>
    <div class="flex vertical">
      <section class="flex">
        <b>locations</b>
        <div>
          <label>
            <input bind:value={newTag} type="text" />
          </label>
          {#if $selectedLocations.length > 0}
            <button on:click={startOperation}
              >Add {newTag} to {$selectedLocations.length} locations</button
            >
          {/if}
        </div>
      </section>

      <section class="flex vertical">
        <b>routes</b>
        <small>enable drag update of routes</small>

        <input
          type="checkbox"
          on:change={toggleDragBox}
          bind:checked={dragUpdateEnabled}
        />
        {#if dragUpdateEnabled}
          <input
            placeholder="route type"
            bind:value={newRouteType}
            type="text"
          />
        {/if}
      </section>
      <div class="flex">
        <button on:click={copyLocationsToClipboard}>Copy locations</button>
      </div>
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
