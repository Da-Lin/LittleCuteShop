import { collection, query, getDocs, where, documentId, getDoc, doc, setDoc, getCountFromServer, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export const addToCart = async (cart) => {
    let existingCart = await getCart()
    if (!existingCart) {
        existingCart = {}
    }
    if (!(cart.productId in existingCart)) {
        existingCart[cart.productId] = cart
    }

    const docRef = doc(db, `users`, auth.currentUser.uid)
    return updateDoc(docRef, {
        cart: existingCart
    });
};

export const getCart = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log(docSnap.data().cart)
        return docSnap.data().cart
    }
};