<script lang="ts">
  import { onMount } from "svelte";

  import Dialog from "./lib/Blocks/Dialog.svelte";
  import Search from "./lib/Blocks/Search.svelte";
  import Map from "./Map.svelte";

  import { paths, points } from "../public/data.json";
  import { convertPoints } from "./lib/utility";

  let locations = convertPoints(points);

  let zoomTo;
  for (const point of points) {
  }
  // console.log();
  // console.log(points.filter(p=>p.tags && p.tags.includes("art")));
  // images

  let img = points
    .filter((p) => p.images)
    .map(({ id, images }) => ({ id, images }));
  console.log(img);

  onMount(async () => {});
</script>

<Search></Search>
<nav class="bottom right">
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content">hi lol</div>
  </Dialog>
</nav>

<Map {locations} bind:zoomTo />

<style>
</style>
