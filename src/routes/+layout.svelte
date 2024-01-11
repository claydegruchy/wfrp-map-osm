<script lang="ts">
  import "../app.css";

  import { FirebaseApp, Collection } from "sveltefire";
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  import { collection, query, where, getDocs } from "firebase/firestore";

  import {
    store_firestore,
    store_pointsRef,
    store_pathRef,
    store_userRef,
  } from "$store";


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

  const pointsRef = collection(firestore, "points");
  const pathRef = collection(firestore, "paths");
  const userRef = collection(firestore, "users");

  store_firestore.set(firestore);
  store_pointsRef.set(pointsRef);
  store_pathRef.set(pathRef);
  store_userRef.set(userRef);
</script>

<FirebaseApp {auth} {firestore}>
  <slot />
</FirebaseApp>

<style></style>
