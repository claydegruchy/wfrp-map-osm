<script let:user>
  import { get } from "svelte/store";
  import { store_pointsRef } from "$store";
  import { Collection, SignedIn } from "sveltefire";
  import { collection, query, where, getDocs } from "firebase/firestore";

  const pointsRef = get(store_pointsRef);
</script>

<div>
  hello
  <SignedIn>
    <Collection ref={query(pointsRef, where("public", "==", true))} let:count>
      <p>Fetched {count} documents</p>
      <!-- {#each data as path}
          <p>{path.name}</p>
        {/each} -->
    </Collection>
  </SignedIn>
  <!-- <Doc ref={`points/`} let:data={point} let:ref={pointRef}></Doc> -->

  <!-- {#each publicPoints as point}
    <Point></Point>
  {/each} -->
</div>
