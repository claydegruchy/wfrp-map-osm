<script>
  export let open = false;

  const toggle = () => (open = !open);
</script>

<button on:click={toggle}>
  {#if open}
    Close
  {:else}
    <slot name="button">Open</slot>
  {/if}
</button>

<dialog {open}>
  <slot name="content"></slot>
</dialog>

<style>
  dialog {
    z-index: -2;
  }
</style>
