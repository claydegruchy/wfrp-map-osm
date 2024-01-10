<script>
  import { SignedIn, SignedOut } from "sveltefire";
  import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

  const googleProvider = new GoogleAuthProvider();
</script>

<SignedIn let:user let:signOut>
  <button on:click={signOut} title="Sign Out">✔️ {user.displayName}</button>
</SignedIn>
