<script>
  import { locationsObject } from "./locations";
  import { getCardinalDirection, meterConv, routesObject } from "./routes";

  export let path;
  export let pathFinderOrigin;
  export let pathFinderDestination;

  export let zoomToLocationById;

  export let clearPath;

  let valid = path && path?.pathNodes?.length > 0;

  let origin = locationsObject[pathFinderOrigin];
  let destination = locationsObject[pathFinderDestination];

  let distance = 0;
  let waterDistance = 0;
  let roadDistance = 0;

  let steps = [];
  let { pathRouteIds, pathNodes } = path;

  if (pathRouteIds && pathNodes) {
    let last;
    pathNodes.forEach((nodeId, i) => {
      let locationData = { ...locationsObject[nodeId] };

      if (i == 0) locationData.tags = [...locationData.tags, "start"];
      if (i == pathNodes.length - 1)
        locationData.tags = [...locationData.tags, "end"];

      if (i != 0) {
        let nextRoute = pathRouteIds.shift();
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

          if (routeData.type == "water") waterDistance += routeData.length;
          if (routeData.type == "road") roadDistance += routeData.length;
        }
      }
      last = locationData;
      steps.push(locationData);
    });
    console.log("bah");
  }

  const milesPerH = {
    walk: 3.5,
    cart: 1.75,
    ride: 7,
    //
    skiff: 1,
    barge: 2,
    warship: 4,
  };

  console.log(steps);
  let roadMethod = "walk";
  let waterMethod = "skiff";
  let hidden = false;

  function distanceToTime(dis, method) {
    return Math.round(meterConv(dis) / milesPerH[method]);
  }
</script>

<main>
  <div class="header flex horizontal">
    {origin.name} to {destination.name} ({meterConv(distance)}mi)
    <div>
      <select class="road" bind:value={roadMethod}>
        <option value="walk">Walk</option>
        <option value="cart">Ox Cart</option>
        <option value="ride">Horse</option>
      </select>
      <select class="water" bind:value={waterMethod}>
        <option value="skiff">Skiff</option>
        <option value="barge">Barge</option>
        <option value="warship">Warship</option>
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
          This route covers {steps.length} locations, and will take ~{distanceToTime(
            roadDistance,
            roadMethod
          ) + distanceToTime(waterDistance, waterMethod)}h of travel
        </small>
        <div class=" steps">
          {#each steps as { id, name, tags, type, route }, i}
            <div
              class="step {type || ''} {tags?.join(' ')} {route?.type} {i == 0
                ? ''
                : ''}"
            >
              {#if !route}
                Start at
              {:else}
                <i class="capitalise">
                  {#if route.type == "road"}
                    {roadMethod}
                  {/if}

                  {#if route.type == "water"}
                    {waterMethod}
                  {/if}
                </i>
                {meterConv(route.length)}
                <small> miles {route.cardinal} to</small>
              {/if}
              <b class="hover-pointer" on:click={() => zoomToLocationById(id)}>
                {name}
              </b>
              {#if route}
                {#if route.type == "road"}
                  ({distanceToTime(route.length, roadMethod)}h)
                {/if}

                {#if route.type == "water"}
                  ({distanceToTime(route.length, waterMethod)}h)
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
  .water {
    --border-start: blue;
  }

  .start,
  .end {
    --border-start: green;
  }
</style>
