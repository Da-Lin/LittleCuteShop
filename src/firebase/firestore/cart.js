import {  getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export const addToCart = async (newItem) => {
    let existingCart = await getCart()
    if (!existingCart) {
        existingCart = {}
    }
    if (!(newItem.productId in existingCart)) {
        existingCart[newItem.productId] = newItem
        const docRef = doc(db, `users`, auth.currentUser.uid)
        return updateDoc(docRef, {
            cart: existingCart
        }).then(() => existingCart)
    }
};

export const getCart = async () => {
    if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(docSnap.data().cart)
            return docSnap.data().cart
        }
    }
};

export const updateCart = async (newCart) => {
    const docRef = doc(db, `users`, auth.currentUser.uid)
    return updateDoc(docRef, {
        cart: newCart
    })
}