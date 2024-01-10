<script>
  import { getContext } from "svelte";

  import Tile from "ol/layer/Tile";
  import TileImage from "ol/source/TileImage";
  import TileGrid from "ol/tilegrid/TileGrid";
  import XYZ from "ol/source/XYZ";
  import SourceTileImage from "ol/source/TileImage";

  const { getMapInstance, getMapUrl } = getContext("mapSharedState");
  const mapInstance = getMapInstance();
  const imageStorageURL = getMapUrl();

  export let folderName;
  export let TileGridData;
  console.log("[ModularMapLayer] initated", folderName);

  const layerTile = new Tile({
    preload: 10,
    source: new SourceTileImage({
      tileGrid: new TileGrid(TileGridData),
      tileUrlFunction: (tileCoord) => {
        return (
          imageStorageURL +
          "/" +
          folderName +
          "{z}/{x}/{y}.png"
            .replace("{z}", String(tileCoord[0]))
            .replace("{x}", String(tileCoord[1]))
            .replace("{y}", String(-1 - tileCoord[2]))
          // .replace("{y}", String(-1 - tileCoord[2]))
        );
      },
    }),
  });

  mapInstance.addLayer(layerTile);
</script>
