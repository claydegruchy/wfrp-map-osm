<script>
  import { get } from "svelte/store";
  import { store_pointsRef } from "$store";
  import { Collection, SignedIn } from "sveltefire";
  import { collection, query, where, getDocs, or } from "firebase/firestore";
  import Point from "./Point.svelte";
  import { getMapInstance, featureAtPixel } from "$lib/utilities.js";
  import VectorLayer from "./VectorLayer.svelte";
  import { sceneStyleGenerator } from "$lib/olStyleBuilder.js";

  const pointsRef = get(store_pointsRef);
  console.log("[Scenes] initated");

  const mapInstance = getMapInstance();

  let info;
  let currentFeature;

  const displayFeatureInfo = (pixel) => {
    const feature = featureAtPixel(pixel, mapInstance);
    if (!feature) return;
    console.log(feature?.values_.name);
    if (feature) {
      info.style.left = pixel[0] + "px";
      info.style.top = pixel[1] + "px";
      if (feature !== currentFeature) {
        info.style.visibility = "visible";
        info.innerText = feature.get("name");
      }
    } else {
      info.style.visibility = "hidden";
    }
    currentFeature = feature;
  };

  mapInstance.on("pointermove", function (evt) {
    if (evt.dragging) {
      info.style.visibility = "hidden";
      currentFeature = undefined;
      return;
    }
    const pixel = mapInstance.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel, evt.originalEvent.target);
  });

  mapInstance.on("click", function (evt) {
    displayFeatureInfo(evt.pixel, evt.originalEvent.target);
  });

  mapInstance.getTargetElement().addEventListener("pointerleave", function () {
    currentFeature = undefined;
    info.style.visibility = "hidden";
  });

  const styleGenerator = (feature, resolution) =>
    sceneStyleGenerator(feature, resolution);
</script>

<SignedIn let:auth>
  <VectorLayer {styleGenerator} let:layer>
    <Collection
      ref={query(pointsRef, where("owner_id", "==", auth?.currentUser?.uid))}
      let:data
    >
      {#each data as point}
        <Point {layer} {point} />
      {/each}
    </Collection>
  </VectorLayer>
</SignedIn>

<Collection ref={query(pointsRef, where("public", "==", true))} let:data>
  <VectorLayer {styleGenerator} let:layer>
    {#each data as point}
      <Point {layer} {point} />
    {/each}
  </VectorLayer>
</Collection>

<div id="info" bind:this={info}></div>

<style>
  #info {
    position: absolute;
    display: inline-block;
    height: auto;
    width: auto;
    z-index: 100;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    left: 50%;
    transform: translateX(3%);
    visibility: hidden;
    pointer-events: none;
  }
</style>
