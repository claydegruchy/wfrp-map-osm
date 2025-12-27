<script lang="ts">
  import { onMount } from "svelte";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";
  import Map from "./lib/Map.svelte";

  let selected;
  function locationSelected(s) {
    selected = s;
  }
</script>

<Search></Search>
<nav class="bottom right">
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content"></div>
  </Dialog>
</nav>

<Map {locationSelected}></Map>

{#if selected}
  <nav class="bottom left">
    {selected.name}
  </nav>
{/if}

<style>
  :global(.map) {
    height: 100%;
    width: 100%;
  }
</style>
