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
    doc,
    collection,
    where,
    setDoc,
    addDoc,
    deleteDoc,
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

const pointsRef = collection(db, "points");

const googleProvider = new GoogleAuthProvider();

// googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);

        // if (docs.docs.length === 0) {
        //     await getDocs(collection(db, "users"), {
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


export const GetPoints = async () => {
    // get public points



    let o = []

    const parse = (doc, abc) => {
        let d = doc.data()
        o.push({ ...d, owned_by_user: d.owner_id == auth?.currentUser?.uid, id: doc.id })
    }
    // get public points
    const publicPoints = await getDocs(query(pointsRef, where("public", "==", true)))
    publicPoints.forEach(parse)
    // if we're logged in, get the private ones too
    if (auth?.currentUser?.uid) {
        const privatePoints = await getDocs(query(pointsRef, where("owner_id", "==", auth?.currentUser?.uid || "dummy")))
        privatePoints.forEach(parse)
    }
    console.table(o)
    // modify duplicate locations
    // [fixme] add a better system for removing duplicates
    o = o.filter((v, i, a) => a.findIndex(v2 => (v2.coordinates.join() === v.coordinates.join())) === i)



    return o
}

export const AddPoint = async ({ point, image }) => {
    console.log("AddPoint", point)
    let newPoint = {
        created: new Date(),
        owner_id: auth.currentUser.uid,
        ...point,
        owned_by_user: undefined,
    }
    // remove stuff we don't want to send to the db
    delete newPoint.owned_by_user
    delete newPoint.id

    await addDoc(pointsRef, newPoint);
}

export const DeletePoint = async (id) => {
    console.log(id);

    await deleteDoc(doc(db, "points", id));
}

