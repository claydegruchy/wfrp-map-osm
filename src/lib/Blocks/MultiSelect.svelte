<!-- MultiSelectDropdown.svelte -->
<script>
  export let options = [];
  export let selected = [];
  export let placeholder = "Select options";

  let open = false;

  // toggle selection
  function toggleOption(option) {
    if (selected.includes(option)) {
      selected = selected.filter((x) => x !== option);
    } else {
      selected = [...selected, option];
    }
  }

  // close dropdown if clicked outside
  function handleClickOutside(event) {
    if (!event.target.closest(".dropdown")) {
      open = false;
    }
  }

  // attach/remove document listener
  import { onMount, onDestroy } from "svelte";
  onMount(() => document.addEventListener("click", handleClickOutside));
  onDestroy(() => document.removeEventListener("click", handleClickOutside));
</script>

<div class="dropdown">
  <div class="selected" on:click={() => (open = !open)}>
    {#if selected.length > 0}
      {selected.join(", ")}
    {:else}
      {placeholder}
    {/if}
  </div>

  {#if open}
    <div class="options">
      {#each options as option}
        <label>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            on:change={() => toggleOption(option)}
          />
          {option}
        </label>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
    width: 200px;
    max-width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
		box-sizing: border-box;

    user-select: none;
  }

  .selected {
    min-height: 20px;
    cursor: pointer;
    text-align: left; /* left align text */
	text-transform: capitalize;
  }

  .options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 5px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 10;
    text-align: left; /* left align checkbox labels */
	text-transform: capitalize;

  }

  label {
    display: block;
    margin-bottom: 3px;
    cursor: pointer;
    text-align: left; /* just in case */
  }
</style>
