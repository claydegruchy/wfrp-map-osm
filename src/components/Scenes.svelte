<script>
  import { get } from "svelte/store";
  import { store_pointsRef } from "$store";
  import { Collection, SignedIn } from "sveltefire";
  import { collection, query, where, getDocs, or } from "firebase/firestore";
  import Point from "./Point.svelte";
  import { getMapInstance, featureAtPixel } from "$lib/utilities.js";

  const pointsRef = get(store_pointsRef);

  const mapInstance = getMapInstance();
  console.log("[Scenes] initated");

  mapInstance.on("pointermove", function (evt) {
    if (evt.dragging) return;
    const feature = featureAtPixel(evt.pixel, mapInstance);
    if (!feature) return;
    console.log(feature?.values_.name);
  });
</script>

<SignedIn let:auth>
  <Collection
    ref={query(pointsRef, where("owner_id", "==", auth?.currentUser?.uid))}
    let:data
  >
    {#each data as point}
      <Point {point} />
    {/each}
  </Collection>
</SignedIn>

<Collection ref={query(pointsRef, where("public", "==", true))} let:data>
  {#each data as point}
    <Point {point} />
  {/each}
</Collection>
