<script>
  import Map from "$components/Map.svelte";

  import MapLayer from "$components/MapLayer.svelte";
</script>

<!-- <div class="map flex absolute bottom-0 top-0 right-0 left-0 page"> -->
<Map>
  <MapLayer
    name="world-map"
    attribution="Map tiles by Extract from gitzmansgallery.com: Some original artwork is credited to Andreas Blicher, based upon Alfred Nunez, Jr.'s outstanding cartography and research"
    relativeUrl={"/world-map/{z}/{z}_{x}_{y}.jpg"}
    minzoom={0}
    maxzoom={20}
  />

  <MapLayer
    name="altdorf"
    attribution="Map tiles by Extract from gitzmansgallery.com: Some original artwork is credited to Andreas Blicher, based upon Alfred Nunez, Jr.'s outstanding cartography and research"
    relativeUrl={"/altdorf/{z}/{x}/{y}.png"}
    minzoom={1}
    maxzoom={7}
    tileSize={256}
    bounds={[
      -1879572.67834710842, 3734469.05619834783, -1754782.27834710851,
      3824113.85619834764,
    ]}
  />
</Map>
<!-- </div> -->
