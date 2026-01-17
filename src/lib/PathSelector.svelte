<script>
  import { sector } from "@turf/turf";
  import { locationsObject, zoomToLocationById } from "./locations";
  import PathDisplay from "./PathDisplay.svelte";
  import {
    pathFinderDestination,
    pathFinderOrigin,
    selectedPathIndex,
  } from "./stores";

  export let hidden;
  export let paths;
  export let clearPath;

  const arrays = paths.map((p) => p.pathNodes);

  const len = Math.min(...arrays.map((a) => a.length));

  let diffIndex = -1;

  for (let i = 0; i < len; i++) {
    const values = arrays.map((a) => a[i]);
    if (new Set(values).size > 1) {
      diffIndex = i;
      break;
    }
  }

  const diffIds = [];
  const used = new Set();

  if (diffIndex !== -1) {
    for (const a of arrays) {
      // find first value in sub-array not used yet
      const val = a.slice(diffIndex).find((v) => !used.has(v));
      if (val === undefined)
        throw new Error("Cannot assign unique values for all arrays");
      diffIds.push(val);
      used.add(val);
    }
  }
  console.log({ diffIds });
</script>

<main>
  <section>
    {#each paths as path, i}
      <small>
        <button
          disabled={$selectedPathIndex == i}
          on:click={() => ($selectedPathIndex = i)}
          >Via {locationsObject[diffIds[i]].name}</button
        >
      </small>
    {/each}
  </section>

  <div>
    {#each paths as path, i}
      <div class={i == $selectedPathIndex ? "" : "hidden"}>
        <PathDisplay bind:hidden {clearPath} {zoomToLocationById} {path}
        ></PathDisplay>
      </div>
    {/each}
  </div>
</main>

<style>
  button:disabled {
    background-color: black;
    opacity: 1;
  }
  main {
    display: flex;
    flex-direction: column;
    padding: -2px;
    max-width: 100%;
  }
  section {
    padding: 0.5px;
  }
  .hidden {
    display: none;
  }

  button {
    white-space: nowrap;
  }

  section {
    display: flex;
    flex-wrap: nowrap;
  }

  small {
    flex: 0 0 auto;
  }
</style>
