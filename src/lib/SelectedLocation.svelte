<script>
  export let locations;
</script>

<main>
  {#if locations.length == 1}
    <div>
      <h3>
        {locations[0].name}
      </h3>

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
            <td>{name}</td>
            <td>{tags}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style>
  main {
    width: calc(100% - 40px);
    max-width: 400px;
    border: 2px solid black;
    border-radius: 5px;
    padding: 10px;
    background-color: grey;
    max-height: 50vh;
    overflow: scroll;
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
