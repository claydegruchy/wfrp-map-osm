<script>
  import { get } from "svelte/store";
  import { store_pointsRef } from "$store";
  import { Collection, SignedIn } from "sveltefire";
  import { collection, query, where, getDocs, or } from "firebase/firestore";
  import Point from "./Point.svelte";
  import { getMapInstance, featureAtPixel } from "$lib/utilities.js";
  import VectorLayer from "./VectorLayer.svelte";
  import { sceneStyleGenerator } from "$lib/olStyleBuilder.js";

  import { Interaction } from "ol/interaction.js";
  import { click, pointerMove, altKeyOnly } from "ol/events/condition";

  const pointsRef = get(store_pointsRef);
  console.log("[Scenes] initated");

  const mapInstance = getMapInstance();

  let mv = new Interaction({
    condition: pointerMove,
    onSelect: (e) => {
      console.log(e);
    },
  });

  mapInstance.addInteraction(mv);

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
