<script>
  import { locationsObject } from "./locations";
  import { meterConv, routesObject } from "./routes";

  export let path;
  export let pathFinderOrigin;
  export let pathFinderDestination;

  export let clearPath;
  let valid = path && path?.pathNodes?.length > 0;
  console.log("pd", path, valid);

  let origin = locationsObject[pathFinderOrigin];
  let destination = locationsObject[pathFinderDestination];

  let distance = 0;

  let steps = [];
  let { pathRouteIds, pathNodes } = path;

  pathNodes.forEach((pathId, i) => {
    steps.push({ kind: "locaton", data: locationsObject[pathId] });
    let nextRoute = pathRouteIds.shift();
    if (nextRoute) {
      steps.push({ kind: "path", data: routesObject[nextRoute] });
      distance += routesObject[nextRoute].length;
    }
  });
  console.log(steps);

  //   pathNodes, pathRouteIds;

  let hidden = false;
</script>

<main>
  <div>
    <div class="flex horizontal">
      {origin.name} to {destination.name}
      <div>
        <button on:click={clearPath}>Clear</button>
        <button class="hidden" on:click={() => (hidden = !hidden)}
          >{hidden ? "v" : "^"}</button
        >
      </div>
    </div>

    {#if valid}
      {#if !hidden}
        <div class="flex vertical">
          This route covers {meterConv(distance)} miles, spanning {path
            .pathNodes.length} locations
          <div class="flex vertical">
            {#each steps as { kind, data }}
              <div>
                {#if kind == "locaton"}
                  {data.name}
                {:else}
                  {#if data.type == "road"}
                    Walk
                  {/if}
                  {#if data.type == "water"}
                    Sail or swim
                  {/if}
                  ~ {meterConv(data.length)} miles
                {/if}
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
