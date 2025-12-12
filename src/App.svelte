<script lang="ts">
  import { onMount } from "svelte";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";
  import Map from "./Map.svelte";

  let locations = {};
  onMount(async () => {});
</script>

<Search></Search>
<nav class="bottom right">
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content">hi lol</div>
  </Dialog>
</nav>

<Map />

<style>

</style>
