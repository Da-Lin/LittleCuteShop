import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const readStore = async (storeName) => {
    const querySnapshot = await getDocs(collection(db, storeName));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
};