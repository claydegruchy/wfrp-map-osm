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
    steps.push({ kind: "locaton", data });
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
          <div class="flex vertical steps">
            {#each steps as { kind, data }}
              <section
                class="step {kind} {data?.kind || ''} {data?.tags?.join(' ')}"
              >
                {#if kind == "locaton"}
                  Visit {data.name}
                {:else}
                  {#if data.type == "road"}
                    Walk
                  {/if}
                  {#if data.type == "water"}
                    Sail or swim
                  {/if}
                  ~{meterConv(data.length)} miles {data.cardinal}
                {/if}
              </section>
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
  }

  .step {
  }

  .location {
  }

  .location.city {
  }

  .path {
  }

  .path.road {
  }
  .path.water {
  }
</style>
