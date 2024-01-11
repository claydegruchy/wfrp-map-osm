<script>
  import Map from "$components/Map.svelte";

  import MainMapLayer from "$components/MainMapLayer.svelte";
  import ModularMapLayer from "$components/ModularMapLayer.svelte";
  import Scenes from "$components/Scenes.svelte";

  import { maps } from "$lib/maps.js";
</script>

<Map>
  <MainMapLayer />
  <Scenes />

  {#each maps as map}
    <ModularMapLayer
      folderName={map.folderName}
      TileGridData={map.TileGridData}
    />
  {/each}
</Map>
