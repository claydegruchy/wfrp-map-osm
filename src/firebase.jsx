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
    doc,
    collection,
    getDocs,
    getDoc,
    where,
    addDoc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";

import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    getStorage,
    deleteObject,
} from "firebase/storage";




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
export const storage = getStorage(app)

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
    // console.table(o)
    // modify duplicate locations
    // [fixme] add a better system for removing duplicates
    o = o.filter((v, i, a) => a.findIndex(v2 => (v2.coordinates.join() === v.coordinates.join())) === i)



    return o
}



export const AddPoint = async ({ point, file, progressHook }) => {
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

    console.log({ newPoint })

    let uploadedPoint = await addDoc(pointsRef, newPoint);

    return new Promise((resolve, reject) => {
        if (file && file != "") {
            // upload the file, gets its ID
            // if we got an ID, update the point with the new image id
            const name = crypto.randomUUID();
            const storageRef = ref(storage, `/files/${name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressHook && progressHook({ progress, state: snapshot.state })
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.log("upload fucked up", error);
                    reject(error)
                },
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // update the point to have the src of the image
                        setDoc(uploadedPoint, { ...newPoint, src: downloadURL }).then(resolve)
                    });
                }
            );

        } else {
            resolve(uploadedPoint)
        }
    })
}

const DeleteImage = async (point) => {
    let { src } = point.data()
    if (!src) return 
    const fileRef = ref(storage, src);
    console.log({fileRef});

    return await deleteObject(fileRef)
}

export const DeletePoint = async (id) => {

    // get the point
    // if it has an image, delete that first
    // then delete the point itself, if not error
    let pointRef = await doc(db, "points", id);
    try {
        let p = await getDoc(pointRef)
        await DeleteImage(p)
        return await deleteDoc(pointRef)
    } catch (error) {
        console.log('[delete failed]', error);
        throw error
    }
}



