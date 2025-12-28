<script>
  import { locations, locationsObject } from "./locations";
  import { diagnosticFeatures } from "./stores";

  //   function copyToClipboard() {
  //     navigator.clipboard
  //       .writeText(text)
  //       .then(() => {
  //         console.log("Copied:", text);
  //       })
  //       .catch((err) => {
  //         console.error("Failed to copy:", err);
  //       });
  //     ready = false;
  //   }

  function startOperation() {
    for (const f of $diagnosticFeatures) {
      let id = f.getId();
      let location = locationsObject[id];
      if (!location) alert("location not found" + id);
      location.tags.push(newTag);
      locationsObject[id] = location;
    }
    let newLocations = Object.values(locationsObject);
    console.log({ newLocations });

    ready = true;
  }
  let ready = false;
  let newTag;
</script>

<main>
  {#each $diagnosticFeatures as f}
    <div>
      {f.getId()}
    </div>
  {/each}

  <label>
    <input bind:value={newTag} type="text" />
  </label>
  <button on:click={startOperation}
    >Add {newTag} to {$diagnosticFeatures.length} locations</button
  >
  <button>copy</button>
</main>

<style>
  main {
    width: calc(100% - 40px);
    max-width: 400px;
    border: 2px solid black;
    border-radius: 5px;
    padding: 10px;
    background-color: grey;
  }
</style>
