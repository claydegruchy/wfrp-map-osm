<script lang="ts">
  import "../app.css";

  import { FirebaseApp } from "sveltefire";
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  import { getAuth } from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyAIuuslz-mzVUlKj0ccbQ4dbxE6t4ims5Q",
    authDomain: "wfrp-map-system.firebaseapp.com",
    projectId: "wfrp-map-system",
    storageBucket: "wfrp-map-system.appspot.com",
    messagingSenderId: "1023795605850",
    appId: "1:1023795605850:web:f5c1292289b85b23f54363",
    measurementId: "G-ST5035RYSY",
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const firestore = getFirestore(app);
  export const auth = getAuth(app);
</script>

<FirebaseApp {auth} {firestore}>
  base layout
  <slot class="flex h-screen" />
</FirebaseApp>

<style></style>
