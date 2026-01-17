<script>
  import { locationsObject } from "./locations";
  import {
    distanceToTime,
    getCardinalDirection,
    meterConv,
    routesObject,
  } from "./routes";
  import {
    pathFinderDestination,
    pathFinderOrigin,
    riverMode,
    roadMode,
    seaMode,
    speeds,
    underwayMode,
  } from "./stores";
  export let path;
  export let zoomToLocationById;
  export let clearPath;

  let valid = path && path?.pathNodes?.length > 0;

  let origin = locationsObject[$pathFinderOrigin];
  let destination = locationsObject[$pathFinderDestination];

  let distance = 0;
  let duration = 0;

  let steps = [];
  let { pathRouteIds, pathNodes, pathRouteTags } = path;

  if (pathRouteIds && pathNodes) {
    let last;
    pathNodes.forEach((nodeId, i) => {
      let locationData = { ...locationsObject[nodeId] };

      if (i == 0) locationData.tags = [...locationData.tags, "start"];
      if (i == pathNodes.length - 1)
        locationData.tags = [...locationData.tags, "end"];

      if (i != 0) {
        let nextRoute = pathRouteIds.shift();
        let method = pathRouteTags.shift();
        if (nextRoute) {
          let routeData = {
            ...routesObject[nextRoute],
            cardinal: getCardinalDirection(
              last.coordinates,
              locationData.coordinates
            ),
          };
          locationData.route = routeData;

          distance += routeData.length;
          if (speeds[method]) {
            if (method == "road") {
              duration += distanceToTime(
                routeData.length,
                speeds[method][$roadMode]
              );
            }
            if (method == "river") {
              duration += distanceToTime(
                routeData.length,
                speeds[method][$riverMode]
              );
            }
            if (method == "sea") {
              duration += distanceToTime(
                routeData.length,
                speeds[method][$seaMode]
              );
            }
            if (method == "underway") {
              duration += distanceToTime(
                routeData.length,
                speeds[method][$underwayMode]
              );
            }
          }
        }
      }
      last = locationData;
      steps.push(locationData);
    });
  }
  console.log({ path });

  export let hidden = false;
</script>

<main>
  <div class="header flex horizontal">
    {origin.name} to {destination.name} ({meterConv(distance)}mi)
    <div>
      <select class="road" bind:value={$roadMode}>
        {#each Object.keys(speeds.road) as val}
          <option value={val}>{val}</option>
        {/each}
      </select>

      <select class="river" bind:value={$riverMode}>
        {#each Object.keys(speeds.river) as val}
          <option value={val}>{val}</option>
        {/each}
      </select>

      <select class="sea" bind:value={$seaMode}>
        {#each Object.keys(speeds.sea) as val}
          <option value={val}>{val}</option>
        {/each}
      </select>
    </div>
    <button on:click={clearPath}>Clear</button>
    <button class="hidden" on:click={() => (hidden = !hidden)}
      >{hidden ? "v" : "^"}</button
    >
  </div>

  <div class="flex vertical steps-container">
    {#if valid}
      {#if !hidden}
        <small>
          This route covers {steps.length} locations, and will take ~{duration}h
          of travel
        </small>
        <div class=" steps">
          {#each steps as { id, name, tags, type, route }, i}
            <div
              class="step {type || ''} {tags?.join(' ')} {route?.tags} {i == 0
                ? ''
                : ''}"
            >
              {#if !route}
                Start at
              {:else}
                <i class="capitalise">
                  {#if route.tags.includes("road")}
                    {$roadMode}
                  {/if}

                  {#if route.tags.includes("river")}
                    {$riverMode}
                  {/if}

                  {#if route.tags.includes("sea")}
                    {$seaMode}
                  {/if}
                </i>
                {meterConv(route.length)}
                <small> miles {route.cardinal} {name ? "to" : ""}</small>
              {/if}
              <b class="hover-pointer" on:click={() => zoomToLocationById(id)}>
                {name}
              </b>
              {#if route}
                {#if route.tags.includes("road")}
                  ({distanceToTime(route.length, speeds.road[$roadMode])}h)
                {/if}

                {#if route.tags.includes("river")}
                  ({distanceToTime(route.length, speeds.river[$riverMode])}h)
                {/if}

                {#if route.tags.includes("sea")}
                  ({distanceToTime(route.length, speeds.sea[$seaMode])}h)
                {/if}
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

  option {
    text-transform: capitalize;
  }

  .header > button:hover {
    background-color: #555;
  }

  .header > button.hidden {
    font-weight: bold;
  }

  select {
    border: 1px solid var(--border-start);
  }

  .hover-pointer {
    cursor: pointer;
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
    --border-start: black;
    --border-end: black;

    border: 1px solid;
    border-image: linear-gradient(90deg, var(--border-start), var(--border-end))
      1;
    border-radius: 5px;
    padding: 5px;
  }

  .step.city {
    --border-end: gold;
  }

  .road {
    --border-start: brown;
  }
  .river {
    --border-start: blue;
  }

  .start,
  .end {
    --border-start: green;
  }
</style>
