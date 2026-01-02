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
        editId + "_hammermap.json"
      )}
    >Export ({$localRoutes.length + $localLocations.length})
  </button>
  <button on:click={clearLocalFeatures}
    >Delete all ({$localRoutes.length + $localLocations.length})</button
  >
</section>
