<script>
  import Map from "$components/Map.svelte";

  import MainMapLayer from "$components/MainMapLayer.svelte";
  import ModularMapLayer from "$components/ModularMapLayer.svelte";
  import Scenes from "$components/Scenes.svelte";

  import { maps } from "$lib/maps.js";
</script>

<!-- <div class="map flex absolute bottom-0 top-0 right-0 left-0 page"> -->
<Map>
  <MainMapLayer />

  {#each maps as map}
    <ModularMapLayer
      folderName={map.folderName}
      TileGridData={map.TileGridData}
    />
  {/each}
  <Scenes />
</Map>

<!-- </div> -->
