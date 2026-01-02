<script>
  import {
    clearLocalFeatures,
    editId,
    localLocations,
    localRoutes,
  } from "./stores";

  function downloadJSON(obj, filename = "data.json") {
    const blob = new Blob([JSON.stringify(obj, null, "\t")], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  }
  let fileInput;

  function openPicker() {
    fileInput.click();
  }
  function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        console.log(data);
      } catch {
        console.error("Invalid JSON");
      }
    };
    reader.readAsText(file);
  }

  let confirmDelete = false;
</script>

<section class="flex vertical">
  <input
    type="file"
    accept="application/json"
    bind:this={fileInput}
    on:change={onFileChange}
    hidden
  />

  <button on:click={openPicker}>Import </button>
  <button
    on:click={() =>
      downloadJSON(
        { routes: $localRoutes, locations: $localLocations },
        "hammermap_" + Date.now() + "_" + editId + ".json"
      )}
    >Export ({$localRoutes.length + $localLocations.length})
  </button>
  {#if confirmDelete}
    <button
      on:click={() => {
        clearLocalFeatures();
        confirmDelete = false;
      }}
      >Confirm delete of {$localRoutes.length} routes and {$localLocations.length}
      locations?</button
    >
  {:else}
    <button
      on:click={() => {
        confirmDelete = true;
      }}>Delete all</button
    >
  {/if}
</section>
