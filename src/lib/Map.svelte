<script>
  import { onMount } from "svelte";
  import Map from "ol/Map.js";
  import View from "ol/View.js";
  import { map } from "./stores";
  import "ol/ol.css";
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

  import { locationsLayer, setupLocations } from "./locations";

  let center = [-3247495.2505356777, 4704319.403427397];
  let zoom = 5;

  export let locationSelected;

  export let selectLocationById;
  export let zoomToLocationById;

  onMount(() => {
    $map = new Map({
      target: "map",
      controls: [], // no zoom, no attribution, nothing

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
        locationsLayer,
      ],
      view: new View({
        center,
        zoom,
        // rotation: 45, 
      }),
    });

    [selectLocationById, zoomToLocationById] = setupLocations(
      $map,
      locationSelected
    );
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
