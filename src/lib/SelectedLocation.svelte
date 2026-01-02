<script>
  export let locations;
</script>

<main>
  {#if locations.length == 1}
    <div>
      <b>
        {locations[0].name || "Unnamed"}
      </b>
      <div>
        <i>Added by {locations[0].credit}</i>
      </div>
      <div>
        {#each locations[0].art as image}
          <a href={image} target="_blank" rel="noopener noreferrer">
            <img src={image} alt="" />
          </a>
        {/each}
      </div>
      <div class="flex">
        {#each locations[0].tags as tag}
          <div class="title tag">
            {#if tag.includes("country:")}
              Country:
            {/if}
            {#if tag.includes("state:")}
              State:
            {/if}
            {#if tag.includes("city:")}
              City:
            {/if}
            <i class={tag.split(":").at(-1)}> {tag.split(":").at(-1)}</i>
          </div>
        {/each}
        <small>
          <i>({locations[0].id})</i>
        </small>
      </div>
    </div>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        {#each locations as { name, tags }, i}
          <tr>
            <td>{name || "Unnamed"}</td>
            <td>{tags}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style>
  main {
    border: 1px solid black;
    border-radius: 5px;
    padding: 10px;
    background-color: grey;
    overflow-y: scroll;
    max-height: 50vh;
  }

  img {
    max-width: 90%;
  }

  table {
    background-color: grey;
    text-align: left;
  }

  .flex {
    flex-wrap: wrap;
  }

  .title {
    text-transform: capitalize;
  }

  .tag {
    display: inline-block;
    padding: 0.2em 0.6em;
    font-size: 0.85em;
    border-radius: 0.25em;
    background: #eee;
    color: #333;
  }

  .the-empire {
    background: #b11226;
  }
</style>
