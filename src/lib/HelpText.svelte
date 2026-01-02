<script>
  let name = "";
  function turnOnEditMode() {
    const url = new URL(window.location.href);
    url.searchParams.set("edit", name);
    window.location.href = url.toString();
  }
</script>

<main>
  <h2>Hammermap</h2>
  <p>
    A Warhammer mapping system <i>
      by <a href="https://github.com/claydegruchy/">Clay D</a>
    </i>
  </p>
  <p>
    This is a searchable Warhammer Fantasy world map that allows you to inspect
    points of interest and plot routes around the Warhammer Fantasy world.
  </p>
  <p>
    You can also customise it by adding your own locations and routes, useful
    when planing one of the Warhammer Fantasy TTRPGs.
  </p>
  <p>This map was made using the amazing maps over at gitzmansgallery.</p>

  <h4>If you want to customise the map</h4>
  <p>
    Enter a name below that you want to use as your signature on newly added
    locations (can be whatever, it'll show at the bottom of locations you've
    added) then hit "Turn on edit mode".
  </p>
  <p>
    This will redirect you to this page again but with <b>edit mode</b> active.
  </p>
  <div class="flex">
    <input placeholder="Enter name" bind:value={name} type="text" />
    <button on:click={turnOnEditMode} disabled={name.length < 1}
      >Turn on edit mode</button
    >
  </div>
  <p>You can bookmark the edit URL if you want to go there directly later</p>
  <p>
    Note: This doesn't send anything to a server, it just redirects you. You can
    active <b>edit mode</b> manually by adding
    <b>?edit=<i>your_name_here</i></b>
    to the end of this URL in the browser.
  </p>
  <h4>If you want to contribute to the master map</h4>
  <p>
    If you want to add locations or routes to the master map, turn on <b
      >edit mode</b
    >
    and hit >How do I add stuff? The process is pretty easily though, just add custom
    points to a map and send me your backup file.
  </p>
  <p>
    If you want to add artwork to the map or detailed town maps then I can add
    maps for you, assuming they're free to use or you own them. Hit me up on
    this
    <a href="https://forms.gle/5RRtzuv3Um5xN9Eh9"> Google Form</a>
    and I'll try to add it for you
  </p>
  <h4>Credits</h4>
  <p>
    Big thanks to gitzmansgallery for the main map. Extract from
    gitzmansgallery.com:
  </p>

  <p>
    <i>
      Some original artwork is credited to Andreas Blicher, based upon Alfred
      Nunez Jr.'s outstanding cartography and research. Many other sources were
      used including those from the Warhammer Maps page.
    </i>
  </p>
  <p>
    The distances are pulled from <i
      >Travel Distances in the Empire (and beyond) by Jackdays</i
    > also from gitzmansgallery
  </p>
  <p>
    Thanks to Magnus Seter via http://altdorfer.blogspot.com for Altdorf. I hope
    to load the various POIs one day.
  </p>

  <p>
    Big thanks to{" "}
    <a href="https://www.deviantart.com/planjanusza"> planjanusza</a>
    {" "} for the free listed assets on their deviantart. Amazing stuff and inspired
    me to make this. Multiple maps are used from here.
  </p>
  <h4>Why did you make this?</h4>

  <p>
    I wanted to learn QGIS, I like warhammer, and I found plotting routes a
    little tedious so I made this.
  </p>

  <h4 class="green">>I think this looks like shit</h4>

  <p>That's just like your opinion, man.</p>

  <h4>Why is there really bad looking AI art in here?</h4>
  <p>
    I used AI art in some games with my group in 2023, and loaded it into the
    map for easier finding. It was a different time.
  </p>

  <h4>Updates</h4>
  <ul>
    <li>
      2026/1: Added feature to let people make custom maps and share them, as
      well as contribute to the master map
    </li>
    <li>2026/1: Added brettonia</li>
    <li>
      2025/12: Added route display with selectable transport methods for time
      calculation
    </li>
    <li>
      2025/12: Added route plotting with lore accurate distances (from my other
      project <a href="https://map.weylandyutani.company/">
        Alien RPG Startmap
      </a>)
    </li>
    <li>2025/12: Added country and state view overlays (work in progress)</li>
    <li>
      2025/12: De-Googled and made all data local (and accessible in the repo)
    </li>
    <li>2025/10: Added a search function</li>
  </ul>
  <br />
  <br />
  <br />
  <br />
  <br />
</main>

<style>
  main {
    text-align: left;
  }

  span {
    display: inline;
  }

  .green {
    color: #789922;
  }
</style>
