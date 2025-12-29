<script>
  import { locationsObject } from "./locations";
  import { getCardinalDirection, meterConv, routesObject } from "./routes";

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

  pathNodes.forEach((nodeId, i) => {
    let data = locationsObject[nodeId];
    steps.push({ kind: "location", data });
    let nextRoute = pathRouteIds.shift();
    if (nextRoute) {
      let next = locationsObject[pathNodes[i + 1]];
      steps.push({
        kind: "path",
        data: {
          ...routesObject[nextRoute],
          cardinal: getCardinalDirection(data.coordinates, next.coordinates),
        },
      });
      distance += routesObject[nextRoute].length;
    }
  });

  let hidden = false;
</script>

<main>
  <div>
    <div class="flex horizontal">
      {origin.name} to {destination.name} ({meterConv(distance)}mi)
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
          <div class=" steps">
            {#each steps as { kind, data }, i}
              <div
                class="step {kind} {data?.kind || ''} {data?.type ||
                  ''} {data?.tags?.join(' ')}"
              >
                {#if kind == "location"}
                  {#if i == 0}
                    Start at
                  {:else if i === steps.length - 1}
                    Finish at
                  {:else}
                    Visit
                  {/if}
                  <b>
                    {data.name}
                  </b>
                {:else}
                  <i>
                    {#if data.type == "road"}Walk{/if}
                    {#if data.type == "water"}Sail or swim{/if}
                    ~{meterConv(data.length)} miles {data.cardinal}
                  </i>
                {/if}
              </div>
            {/each}
            <br />
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

  .steps {
    gap: 3px;
    text-align: left;
    display: flex;
    flex-direction: column;
  }

  .step {
    border: 1px solid black;
    border-radius: 5px;
    padding: 10px;
  }

  .location {
    border-color: blue;
  }

  .location.city {
    border-color: gold;
  }

  .path {
    text-align: center;
    max-width: 90%;
  }

  .path.road {
    border-color: brown;
  }
  .path.water {
    border-color: blue;
  }
</style>
