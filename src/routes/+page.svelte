<script>
  import { Doc, Collection } from "sveltefire";
  import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  const googleProvider = new GoogleAuthProvider();

  import LoginToggle from "../components/LoginToggle.svelte";
</script>

<LoginToggle />

<Doc ref="points/id" let:data>
  <h2>{data.id}</h2>
  <!-- <p>{data.content}</p> -->
</Doc>

<Collection ref="points" let:data={points}>
  {#each points as point}
    <h2>{point.title}</h2>
    <p>{point.content}</p>
  {/each}
</Collection>
