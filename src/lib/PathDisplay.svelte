<script>
  import { locationsObject } from "./locations";

  export let path;
  export let pathFinderOrigin;
  export let pathFinderDestination;

  export let clearPath;
  $: valid = path && path?.pathNodes?.length > 0;
  console.log("pd", path, valid);

  $: origin = locationsObject[pathFinderOrigin];
  $: destination = locationsObject[pathFinderDestination];
  let hidden = false;
</script>

<main>
  <div>
    <div class="flex horizontal">
      {origin.name} to {destination.name}
      <div>
        <button class="hidden" on:click={() => (hidden = !hidden)}
          >{hidden ? "v" : "^"}</button
        >
        <button on:click={clearPath}>Clear</button>
      </div>
    </div>

    {#if valid}
      {#if !hidden}
        <div class="flex vertical">
          <div class="flex vertical">
            {#each path.pathNodes as id}
              <div>
                {locationsObject[id].name}
              </div>
            {/each}
          </div>
        </div>
      {:else}{/if}
    {:else}
      No path could be found between {origin.name} and {destination.name}
    {/if}
  </div>
</main>

<style>
  main {
    border: 2px solid black;
    border-radius: 5px;
    /* padding: 10px; */
    background-color: grey;
    padding: 10px;
    max-height: 50vh;
    display: flex;
    overflow-y: scroll;
  }
</style>
