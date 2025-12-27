<script>
  import { onMount } from "svelte";
  import Map from "ol/Map.js";
  import View from "ol/View.js";
  import TileLayer from "ol/layer/Tile.js";
  import { XYZ } from "ol/source";
  import { map } from "./stores";
  import "ol/ol.css";
  import { TileGrid } from "ol/tilegrid";
  import {
    Marienburg,
    AltdorfMap,
    BelAliad,
    Carroburg,
    Kemperbad,
    Miragliano,
    Nuln,
    Praag,
    Sartosa,
    Ubersreik,
    world,
  } from "./maps";

  let center = [-3247495.2505356777, 4704319.403427397];
  let zoom = 5;

  onMount(() => {
    $map = new Map({
      target: "map",
      layers: [
        world,
        Marienburg,
        AltdorfMap,
        BelAliad,
        Carroburg,
        Kemperbad,
        Miragliano,
        Nuln,
        Praag,
        Sartosa,
        Ubersreik,
      ],
      view: new View({ center, zoom }),
    });
  });

  $: if ($map) {
    $map.getView().setCenter(center);
    $map.getView().setZoom(zoom);
  }
</script>

<div id="map"></div>

<style>
  #map {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
