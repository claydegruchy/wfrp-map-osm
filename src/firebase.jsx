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


async function Utility_PointUpdateOperations() {

    const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})


    GetPoints()
        .then(async points => {
            for (let point of points) {
                if (!point.images) point.images = [point.src]
                if (!point.category) point.tags = ["art"]
                delete point.src
                const newPoint = sortObject(point)
                // console.log(newPoint);
                // let pointRef = await doc(db, "points", point.id);
                // console.log(pointRef);
                // let out = await setDoc(pointRef, newPoint)
                // log
            }
            return points
        })
        .then(console.log)

}





export const UploadFile = async ({ thumbnail, file, name, progressHook }) => {
    return await new Promise((resolve, reject) => {
        // upload the file, gets its ID
        // if we got an ID, update the point with the new image id

        if (thumbnail) name = 'thumbnail_' + name

        const storageRef = ref(storage, `/${thumbnail ? 'thumbnails' : 'files'}/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, thumbnail ? thumbnail : file);

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
                    console.log(downloadURL);
                    resolve(downloadURL)
                    // update the point to have the src of the image
                });
            }
        );

    })
}

export const AddPoint = async ({ point, imageFiles, progressHook, thumbnail }) => {
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


    if (imageFiles && imageFiles.length > 0) {

        // let temp = { ...newPoint, images: [], thumb_src: null }
        // let temp = { ...newPoint, images: [mainImageSRC], thumb_src: thumbnailSRC }
        newPoint.images = []

        console.log("uploading thumb");
        const thumbName = crypto.randomUUID();
        newPoint.thumb_src = await UploadFile({ thumbName, thumbnail, progressHook })
        console.log("uploading thumb done", newPoint.thumb_src);
        console.log("uploading images");


        for (const image of imageFiles) {
            const imageName = crypto.randomUUID();
            let imageSRC = await UploadFile({ imageName, image, progressHook })
            newPoint.images.push(imageSRC)
            console.log("uploaded image", imageSRC);
        }
        console.log("updating point with images", newPoint);
        let updatedPoint = await setDoc(uploadedPoint, newPoint)

        return updatedPoint
    } else {
        return uploadedPoint
    }

}

const DeleteImage = async (point) => {
    let { images, thumb_src } = point.data()
    if (images && images.length > 0) {
        for (const image of images) {
            await deleteObject(ref(storage, image))
        }

    }
    if (thumb_src) await deleteObject(ref(storage, thumb_src))

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



