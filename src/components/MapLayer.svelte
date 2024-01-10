<script>
  import { getContext } from "svelte";
  import { convertToLongLat, convertBoundsToLongLat } from "$lib/utilities.js";

  const { getMapInstance, getMapUrl } = getContext("mapSharedState");
  const mapInstance = getMapInstance();
  const imageStorageURL = getMapUrl();

  export let name;
  export let attribution;
  export let tileSize = 256;
  export let relativeUrl;
  export let bounds;
  export let minzoom;
  export let maxzoom;

  console.log(name, 1, { bounds });
  if (bounds) {
    // transform bounds from coordinate to longitude/latitude
    console.log(name, 1.1, bounds);
    // console.log(name, 1.5, convertToLongLat([bounds[0], bounds[1]]));
    bounds = convertBoundsToLongLat(bounds);
  }
  console.log(name, 2, { bounds });

  console.log("[MapLayer] mapInstance", name, {
    imageStorageURL,
    attribution,
    tileSize,
    relativeUrl,
    bounds,
    minzoom,
    maxzoom,
  });

  mapInstance.on("load", function () {
    // if (bounds) return;
    mapInstance.addSource(name, {
      type: "raster",
      tiles: [imageStorageURL + relativeUrl],
      tileSize,
      attribution,
      ...(bounds && { bounds }),
    });

    mapInstance.addLayer({
      id: name,
      type: "raster",
      source: name,
      minzoom,
      maxzoom,
    });
  });
</script>
