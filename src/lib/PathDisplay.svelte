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

  if (pathRouteIds && pathNodes)
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
  <div class="header flex horizontal">
    {origin.name} to {destination.name} ({meterConv(distance)}mi)
    <button on:click={clearPath}>Clear</button>
    <button class="hidden" on:click={() => (hidden = !hidden)}
      >{hidden ? "v" : "^"}</button
    >
  </div>

  <div class="flex vertical steps-container">
    {#if valid}
      {#if !hidden}
        This route covers {meterConv(distance)} miles, spanning {path.pathNodes
          .length} locations
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
                  {#if data.tags.includes("city")}
                    City
                  {/if}
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
      {:else}{/if}
    {:else}
      No path could be found between {origin.name} and {destination.name}
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    border-radius: 5px;
    background-color: gray;
    padding: 10px;
    max-height: 50vh; /* total height of main */
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between; /* pushes buttons to edges */
    padding: 0.25rem 0.5rem;
    background-color: #ddd; /* subtle background */
    border-radius: 6px;
    font-weight: 600;
  }

  .header > button {
    font-size: 0.8rem; /* smaller buttons */
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 4px;
    background-color: #888;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .header > button:hover {
    background-color: #555;
  }

  .header > button.hidden {
    font-weight: bold;
  }

  .steps-container {
    flex: 1 1 auto; /* take remaining space */
    overflow-y: auto; /* scroll internally */
    min-height: 0; /* critical: allows flex child to shrink */
    padding: 2px;
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
    border-color: black;
  }

  .location.city {
    border-color: gold;
  }

  .path {
    text-align: center;
  }

  .path.road {
    border-color: brown;
  }
  .path.water {
    border-color: blue;
  }
</style>
