<script>
  import { onMount } from "svelte";
  import { addLocation, locations, locationsObject } from "./locations";
  import {
    addRoute,
    routes,
    routesLayer,
    routesObject,
    routeSource,
    setRoutesDisplay,
    toggleRoutesDisplay,
  } from "./routes";
  import {
    editId,
    addLocationTags,
    clearLocalFeatures,
    isEditMode,
    localLocations,
    localRoutes,
    map,
    isMobile,
  } from "./stores";
  import { platformModifierKeyOnly } from "ol/events/condition";
  import Dialog from "./Blocks/Dialog.svelte";
  import LoadAndSave from "./LoadAndSave.svelte";
  import DragBox from "ol/interaction/DragBox";

  console.log("isEditMode", isEditMode);

  let addOpen = false;

  // let tags = "country:brettonia";
  let lastLocation;
  let coordinates;
  let newLocationName;
  let connectRoute = true;

  let routeType = "road";

  map.subscribe((map) => {
    if (!map) return;
    // for adding new locations
    map.getViewport().addEventListener("contextmenu", (e) => {
      console.log("menu");
      e.preventDefault();
      const pixel = map.getEventPixel(e);
      const c = map.getCoordinateFromPixel(pixel);
      console.log(c);
      coordinates = c;
      addOpen = true;
    });

    let pendingId = null;
    // for adding routes
    map.on("singleclick", (evt) => {
      if (!platformModifierKeyOnly(evt)) return;

      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
        layerFilter: (layer) => layer !== routesLayer,
      });

      if (!feature) return;

      const id = feature.getId();

      if (!pendingId) {
        pendingId = id;
        return;
      }

      let newRoute = addRoute({
        source_id: id,
        destination_id: pendingId,
        type: routeType,
      });
      $localRoutes = [...$localRoutes, newRoute];
      console.log(locations, routes);

      pendingId = null;
    });

    // for removing routes
    const dragBox = new DragBox({
      condition: platformModifierKeyOnly, // Ctrl on Windows/Linux, Cmd on macOS
    });

    map.addInteraction(dragBox);

    dragBox.on("boxend", () => {
      const extent = dragBox.getGeometry().getExtent();

      const toUpdate = [];
      routeSource.forEachFeatureIntersectingExtent(extent, (feature) => {
        toUpdate.push(feature.getId());
      });

      for (const id of toUpdate) {
        if (routesObject[id]) {
          let updatedRoute = { ...routesObject[id], enabled: false };

          $localRoutes = [...$localRoutes, addRoute(updatedRoute)];
          // make water
          // routesObject[id].type = "water"
          // remove
        }
      }
      // routes = Object.values(routesObject);
      // setRoutes();
      // console.log(locations, routes);
    });
  });

  function handleAddLocation() {
    let requiredTags = ["source:quickadd", "added_by:" + editId];
    window.umami?.track("handleAddLocation");

    let location = {
      name: newLocationName,
      coordinates,
      tags: [...requiredTags, ...($addLocationTags?.split(",") || [])],
      credit: editId,
    };

    let newLocation = addLocation(location);
    if (connectRoute && lastLocation) {
      let route = {
        source_id: newLocation.id,
        destination_id: lastLocation.id,
      };

      let newRoute = addRoute({
        source_id: newLocation.id,
        destination_id: lastLocation.id,
      });
      $localRoutes = [...$localRoutes, newRoute];
    }

    lastLocation = newLocation;
    $localLocations = [...$localLocations, newLocation];

    coordinates = null;
    newLocationName = "";
    addOpen = false;
    console.log(locations, routes);
  }

  function focus(node) {
    queueMicrotask(() => node.focus());
  }

  onMount(() => {
    isEditMode && window.umami?.track("openEditMode", { editId });
    for (const location of $localLocations) {
      addLocation(location);
    }
    for (const route of $localRoutes) {
      addRoute(route);
    }

    isEditMode && setRoutesDisplay(true);

    isEditMode &&
      isMobile &&
      alert(
        "Warning: Edit mode isn't designed to work on mobile and the experience will likely be bad.\n\nPlease open edit mode on a desktop browser."
      );
  });
</script>

{#if isEditMode}
  <main>
    {#if isMobile}
      <b class="warning"></b>
    {/if}
    <div>
      <big>
        <b>My map </b>
      </big>
    </div>
    <b>Edit mode enabled</b>
    <div>
      <Dialog>
        <small slot="button">How do I add stuff?</small>
        <div slot="content" class="left-align">
          <h2>Adding your own personal locations and routes</h2>
          <h4>Adding a location</h4>
          <ol>
            <li>Right click on the map where you want a new location</li>
            <li>Type in the name</li>
            <li>Hit enter</li>
          </ol>

          <p>
            You can also have locations automatically add a route between them
            using the `Auto add route` checkbox. This will let you add long
            chains of connected locations easily.
          </p>
          <p>
            Tagging a location with "city" will highlight it red as a major
            settlement
          </p>
          <h4>Adding a route</h4>
          <ol>
            <li>Hold CMD (MacOS) or CTRL (Windows)</li>
            <li>Click the starting location of the route</li>
            <li>Click the ending location of the route</li>
          </ol>
          <h4>Removing routes</h4>
          <p>
            Hold CMD (MacOS) or CTRL (Windows) and drag a box over the routes
            you wish to remove.
          </p>
          <h4>Backup/Share</h4>
          <p>
            Personal locations are saved locally, so be sure to export a backup
            now and then to avoid losing them. You can also share these files
            with others or between your devices.
          </p>
          <h2>Contributing to the master map</h2>
          <p>
            Currently all updates to the master map are done manually by me, but
            I welcome anyone who wants to help contribute.
          </p>
          <h4>Sharing changes</h4>
          <p>
            Add locations to the map as you would for a personal map above, and
            then export and share your backup with me (by email or discord, both
            work).
          </p>
          <ul>
            <li>
              By email - <a
                href="mailto:hammermap@claydegruchy.com?subject=hammermap contribution"
                >hammermap@claydegruchy.com</a
              >
            </li>

            <li>By discord @degruchy</li>
          </ul>
          <p>
            I might need to change submissions to ensure they fit into the map
            properly and work with the pathfinding.
          </p>
          <p>A few high level recommendations:</p>
          <ul>
            <li>
              Try to only add locations that appear directly in the background
              map.
            </li>
            <li>
              Try to only add routes that have a direct road connection or
              direct river connection (a highway direct from Altdorf to
              L'Anguille would be nice to have but not lore accurate).
            </li>
            <li>
              If a route is long and adding a direct connection would make it
              too much of a shortcut (or if it turns a lot of corners), add
              nameless "junction" locations to better represent the route.
            </li>
            <li>
              Try to only tag places as a city if they're a major capital, such
              as Middenheim or Altdorf
            </li>
          </ul>
          <h4>Adding tags</h4>
          There are a few different kinds of tags you can use to categorise locations.
          These let us build state and country maps. These are totally optional though,
          I don't mind adding them later.
          <ul>
            <li>
              <pre>"country:something" </pre>
              <small> ie "country:brettonia" or "country:the empire"</small>
            </li>
            <li>
              <pre>"state:something" </pre>
              <small> ie "state:middenland" or "state:averland"</small>
            </li>
            <li>
              <pre>"city" </pre>
              <small>
                if this is a capital or state capital city, such as altdorf or
                l'anguille
              </small>
            </li>
          </ul>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </Dialog>
    </div>

    {#if addOpen}
      <section>
        <i>New location options</i>
        <div>
          {#key coordinates}
            <input
              placeholder="enter location name"
              use:focus
              on:keydown={(e) => {
                if (e.key === "Enter") {
                  handleAddLocation();
                }
              }}
              type="text"
              bind:value={newLocationName}
            />
          {/key}
          <!-- <div><i>{coordinates}</i></div> -->
          <input
            placeholder="tags seperated by commas"
            type="text"
            bind:value={$addLocationTags}
          />
        </div>
        <div>
          <label for="">
            Auto add {routeType} route ({lastLocation?.name || "none"})
            <input bind:checked={connectRoute} type="checkbox" />
          </label>
        </div>
      </section>
    {/if}
    <section>
      <i>Route settings</i>
      <div>
        <label>
          New route type
          <select bind:value={routeType}>
            <option value="road">Road</option>
            <option value="water">Water</option>
          </select>
        </label>
      </div>
    </section>
    <LoadAndSave></LoadAndSave>
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
