<script lang="ts">
  export let items = [];
  export let closeFn;

  function shuffle() {
    items = items
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
</script>

<div class="flex horizontal controls">
  <button on:click={closeFn}>Close</button>
  <button on:click={shuffle}>Shuffle</button>
  <slot />
</div>

<style>
  .controls {
    margin: 2px;
  }
</style>
