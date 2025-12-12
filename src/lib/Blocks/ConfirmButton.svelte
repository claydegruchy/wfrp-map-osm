<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let confirmText = "Confirm?";

  let confirm = false;
  function toggleConfirm(e) {
    if (!confirm) return (confirm = !confirm);
    confirm = false;
    dispatch("click", e);
  }
</script>

<button on:click={toggleConfirm}>
  {#if !confirm}
    <slot />
  {:else}
    {confirmText}
  {/if}
</button>
