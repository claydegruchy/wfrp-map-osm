<script lang="ts">
  import { onMount } from "svelte";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";
  import Map from "./lib/Map.svelte";

  let locations = {};
  onMount(async () => {});
</script>

<Search></Search>
<nav class="bottom right">
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content"></div>
  </Dialog>
</nav>

<Map></Map>

<style>
</style>
