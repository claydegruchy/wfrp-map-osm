// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";


import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyAIuuslz-mzVUlKj0ccbQ4dbxE6t4ims5Q",
    authDomain: "wfrp-map-system.firebaseapp.com",
    projectId: "wfrp-map-system",
    storageBucket: "wfrp-map-system.appspot.com",
    messagingSenderId: "1023795605850",
    appId: "1:1023795605850:web:f5c1292289b85b23f54363",
    measurementId: "G-ST5035RYSY"
};





// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        // const user = res.user;
        // const q = query(collection(db, "users"), where("uid", "==", user.uid));
        // const docs = await getDocs(q);
        // if (docs.docs.length === 0) {
        //     await addDoc(collection(db, "users"), {
        //         uid: user.uid,
        //         name: user.displayName,
        //         authProvider: "google",
        //         email: user.email,
        //     });
        // }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};


export const logout = () => {
    signOut(auth);
  };
  