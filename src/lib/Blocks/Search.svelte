<script>
  let query = "";
  let results = [];
  let showDropdown = false;
  let selectedName = null;
  let isSearching = false;

  export let lookUpName;

  export let returnSelection = (n) => console.log("returnSelection", n);
  async function handleInput() {
    selectedName = null;
    if (!query.trim()) {
      results = [];
      showDropdown = false;
      return;
    }
    showDropdown = true;
    isSearching = true;
    let queryResult = await lookUpName(query);

    if (queryResult && queryResult.length > -1) {
      results = queryResult;
    }

    isSearching = false;
  }

  function selectName(obj) {
    query = obj.name;
    selectedName = obj.id;
    showDropdown = false;
    returnSelection(obj.id);
  }

  function startSearch(option) {
    console.log("Running search for:", option);
    // replace with actual search logic
    returnSelection(selectedName);
  }

  function clearSearch() {
    selectedName = null;
    query = null;
  }
</script>

<div class="floating-search">
  <input
    type="text"
    bind:value={query}
    on:input={handleInput}
    placeholder="Search name..."
    on:focus={handleInput}
    on:blur={() => setTimeout(() => (showDropdown = false), 100)}
  />

  {#if selectedName || query}
    <button on:click={clearSearch}>Clear</button>
  {/if}
  {#if showDropdown || isSearching}
    <div class="dropdown">
      {#if isSearching}
        <div class="feedback">Searching...</div>
      {:else if results.length === 0}
        <div class="feedback">No results found</div>
      {:else}
        {#each results as { name, id }}
          <div on:mousedown={() => selectName({ id, name })}>{name}</div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .floating-search {
    position: absolute;
    top: 10px;
    left: 0;
    width: calc(100% - 40px);
    margin: 0 20px;
    z-index: 1000;
    display: flex;
    gap: 8px;
  }

  .floating-search input {
    flex: 1;
    padding: 10px;
    font-size: 1.1rem;
    box-sizing: border-box;
  }

  .floating-search button {
    padding: 10px 15px;
    font-size: 1.1rem;
    cursor: pointer;
  }

  .dropdown {
    z-index: 10;
    border: 1px solid #ccc;
    background: white;
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .dropdown div {
    padding: 8px;
    cursor: pointer;
  }

  .dropdown div:hover {
    background: #eee;
  }

  .feedback {
    padding: 8px;
    font-style: italic;
    color: #666;
  }
</style>
