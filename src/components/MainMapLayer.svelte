<script>
  import { getContext } from "svelte";

  import Tile from "ol/layer/Tile";
  import TileImage from "ol/source/TileImage";
  import TileGrid from "ol/tilegrid/TileGrid";
  import XYZ from "ol/source/XYZ";

  const { getMapInstance, getMapUrl } = getContext("mapSharedState");
  const mapInstance = getMapInstance();
  const imageStorageURL = getMapUrl();
  console.log("[MainMapLayer] initated");
  const layerTile = new Tile({
    preload: 10,
    source: new XYZ({
      tileUrlFunction: ([z, x, y]) => {
        if (z > 7) return null;
        // this Z being duplicated is a little stupid
        // but it makes the files much easier to deal with than having them all in one folder
        return imageStorageURL + `/world-map/${z}/${z}_${x}_${y}.jpg`;
      },
    }),
  });

  mapInstance.addLayer(layerTile);
</script>
