<script>
  let name = "";
  function turnOnEditMode() {
    const url = new URL(window.location.href);
    url.searchParams.set("edit", name);
    window.location.href = url.toString();
  }
</script>

<main>
  <span>
    <h2>Hammermap</h2>
    <p>
      A Warhammer mapping system <i>
        by <a href="https://github.com/claydegruchy/">Clay D</a>
      </i>
    </p>
  </span>

  <section>
    <h3>If you want to customise the map</h3>
    <p>
      If you want to make your own locations or contribute to the master map:
    </p>
    <p>
      Enter a name below that you want to use as your signature on newly added
      locations (can be whatever), then hit start.
    </p>
    <p>This will redirect you to this page again but with edit mode active.</p>
    <div class="flex">
      <input placeholder="Enter name" bind:value={name} type="text" />
      <button on:click={turnOnEditMode} disabled={name.length < 1}
        >Turn on edit mode</button
      >
    </div>
    <p>You can bookmark the URL if you want to go there directly later</p>
    <p>
      Alternatively, go there directly by adding ?edit=your_name_here to the end
      of the URL in the browser.
    </p>
  </section>
  <h4>Updates</h4>
  <ul>
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
  <h4>What is this?</h4>
  <p>
    This is a searchable Warhammer world map inspired by the amazing maps over
    at gitzmansgallery. I didn't make any of these maps, just put them together.
  </p>

  <p>
    The distances are pulled from <i
      >Travel Distances in the Empire (and beyond) by Jackdays</i
    > also from gitzmansgallery
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
    I wanted to learn QGIS, I wanted to learn react, and I like warhammer, so I
    made this.
  </p>

  <p>
    Originally I wanted to make a system that would let people share maps and
    crowdsource the world but I had some pretty bad community interactions which
    made me shy on the idea, plus turns out I don't like react.
  </p>

  <p>Now I mostly use it as a personal tool for my campaigns.</p>

  <h4 class="green">>I think this looks like shit</h4>

  <p>That's just like your opinion, man.</p>

  <h4>Why is there really bad looking AI art in here?</h4>
  <p>
    I used AI art in some games with my group in 2023, and loaded it into the
    map for easier finding. It was a different time.
  </p>

  <h4>I have a high def map of a city/part of the world that I want to add</h4>

  <p>
    I can add maps for you if they're free to use or you own them. Hit me up on
    this
    <a href="https://forms.gle/5RRtzuv3Um5xN9Eh9"> Google Form</a>
    and I'll try to add it for you
  </p>
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
