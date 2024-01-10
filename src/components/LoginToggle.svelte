<script>
  import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  import { SignedIn, SignedOut } from "sveltefire";
  const googleProvider = new GoogleAuthProvider();
  const classes =
    "bg-stone-200 text-slate-800 text-sm bg-stone-200 text-black text-sm hover:bg-stone-300 border border-slate-300 hover:border-slate-400";
</script>

<!-- todo merge me -->
<div>
  <SignedOut let:auth>
    <button {classes} on:click={() => signInWithPopup(auth, googleProvider)}
      >Sign In</button
    >
  </SignedOut>

  <SignedIn let:user let:signOut>
    <button {classes} on:click={signOut} title="Sign Out"
      >✔️ {user.displayName}</button
    >
  </SignedIn>
</div>
