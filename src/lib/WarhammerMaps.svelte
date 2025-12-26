<script>
  import { XYZ } from "ol/source";
  import { TileGrid } from "ol/tilegrid";
  import { Layer } from "svelte-openlayers";

  const imageStorageURL = "https://claydegruchy.github.io/wfrp-map-storage";
  const mainMapUrl = imageStorageURL + "/world-map/{z}/{z}_{x}_{y}.jpg";

  // TileGrid from your data
  const marienburgTileGrid = new TileGrid({
    extent: [
      -3320017.90883266041, 4701281.93297282793, -3175634.72078718198,
      4803354.42623188905,
    ],
    origin: [-3320017.90883266041, 4701281.93297282793],
    resolutions: [
      658.5322145745888, 329.2661072872944, 164.6330536436472, 82.3165268218236,
      41.1582634109118, 20.5791317054559, 10.28956585272795, 5.144782926363975,
    ],
    tileSize: [256, 256],
  });

  // XYZ source
  const marienburgSource = new XYZ({
    tileGrid: marienburgTileGrid,
    url: `${imageStorageURL}/marienburg/{z}/{x}/{y}.png`,
  });
</script>

<Layer.Tile source="xyz" url={mainMapUrl} />

<Layer.Tile source={marienburgSource} />
