<script>
  export let location;
  let { tags, name, art } = location;
  console.log(art);

  tags = [...tags, ...tags, ...tags, ...tags];
</script>

<main>
  <h3>
    {name}
  </h3>

  <div>
    {#each art as image}
      <a href={image} target="_blank" rel="noopener noreferrer">
        <img src={image} alt="" />
      </a>
    {/each}
  </div>
  <div class="flex">
    {#each tags as tag}
      <div class="tag {tag.replace(/[\s]+/g, '-').split(':').join(' ')}">
        {tag.split(":").at(-1)}
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    width: calc(100% - 40px);
    max-width: 400px;
    border: 2px solid black;
    border-radius: 5px;
    padding: 10px;
    background-color: grey;
  }

  img {
    width: 20vw;
    max-width: 400px;
  }

  .flex {
    flex-wrap: wrap;
  }

  .tag {
    display: inline-block;
    padding: 0.2em 0.6em;
    font-size: 0.85em;
    border-radius: 0.25em;
    background: #eee;
    color: #333;
  }

  .city {
    background: lightcoral;
  }

  .the-empire {
    background: #b11226;
  }
</style>
