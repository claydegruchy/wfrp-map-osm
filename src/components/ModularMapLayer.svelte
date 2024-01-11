<script>
  import Tile from "ol/layer/Tile";
  import TileImage from "ol/source/TileImage";
  import TileGrid from "ol/tilegrid/TileGrid";
  import XYZ from "ol/source/XYZ";
  import SourceTileImage from "ol/source/TileImage";

  // import later and source vector
  import Vector from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import Feature from "ol/Feature";
  import Polygon from "ol/geom/Polygon";

  import { getContext } from "svelte";
  const { getMapInstance, getMapUrl } = getContext("mapSharedState");
  const mapInstance = getMapInstance();
  const imageStorageURL = getMapUrl();

  export let folderName;
  export let TileGridData;
  console.log("[ModularMapLayer] initated", folderName);

  const layerTile = new Tile({
    preload: 10,
    minZoom: 7,
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
        );
      },
    }),
  });

  mapInstance.addLayer(layerTile);

  const { extent } = TileGridData;
  // convert 2 coord diagonal extent into box

  function convertExtentToBox(extent) {
    const [x1, y1, x2, y2] = extent;
    const box = [
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2],
    ];
    return box;
  }

  // polygon with coords [10000,10000,-10000,10000,-10000,10000,10000,10000]
  const layerTileOutline = new Vector({
    maxZoom: 7,
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new Polygon([convertExtentToBox(extent)]),
        }),
      ],
    }),
  });
  mapInstance.addLayer(layerTileOutline);
</script>
