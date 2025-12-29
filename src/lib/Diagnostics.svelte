<script>
  import DragBox from "ol/interaction/DragBox";
  import { locations, locationsObject } from "./locations";
  import { map, selectedLocations } from "./stores";
  import { routeSource } from "./routes";
  import { platformModifierKeyOnly } from "ol/events/condition";
  let newLocations = "nothing";

  function copyToClipboard() {
    // clean locations

    newLocations = newLocations.map((l) => ({
      ...l,
      tags: [...new Set([...l.tags])],
    }));

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
  let ready = false;
  let newTag;
</script>

<main>
  <label>
    <input bind:value={newTag} type="text" />
  </label>
  {#if $selectedLocations.length > 0}
    <button on:click={startOperation}
      >Add {newTag} to {$selectedLocations.length} locations</button
    >
  {/if}
  <button on:click={copyToClipboard}>copy</button>
</main>

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
