<script>
  /** @type {import('./$types').LayoutData} */
  import LoginToggle from "$components/LoginToggle.svelte";
</script>

<!-- tailwind: make this a floating nav, top left, white background, rounded border px -->
<nav class="absolute flex gap-2 z-10 top-2 left-2">
  <LoginToggle />
</nav>

<slot />
