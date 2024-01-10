<script>
  import { SignedIn, SignedOut, Doc, Collection } from "sveltefire";
  import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

  const googleProvider = new GoogleAuthProvider();
</script>

<SignedOut let:auth>
  <button on:click={() => signInWithPopup(auth, googleProvider)}>Sign In</button
  >
</SignedOut>
