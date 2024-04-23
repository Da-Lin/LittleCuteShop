import { collection, query, getDocs, where, documentId, setDoc, addDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const productCategoriesRef = collection(db, "productCategories");

export const getProductCategories = async () => {
    const productCategories = []
    const querySnapshot = await getDocs(collection(db, "productCategories"));
    querySnapshot.forEach((doc) => {
        productCategories.push(doc.id)
    });
    console.log(productCategories)
    return productCategories
}

export const addProductCategories = async (data) => {
    if (!await productCategoryExist(data)) {
        return setDoc(doc(productCategoriesRef, data), {});
    }
}

export const deleteProductCategories = async (data) => {
    if (await productCategoryExist(data)) {
        return deleteDoc(doc(productCategoriesRef, data));
    }
}

export const productCategoryExist = async (data) => {
    const docRef = doc(db, "productCategories", data);
    const docSnap = await getDoc(docRef);
    return docSnap.exists()
}