import { collection, query, getDocs, where, documentId, setDoc, addDoc, doc, getDoc, deleteDoc, collectionGroup, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { desaturate } from "polished";
import { Description } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const productCategoriesRef = collection(db, "productCategories");
const productsRef = collection(db, "products");
const storage = getStorage();

export const getProductCategories = async () => {
    const productCategories = []
    const querySnapshot = await getDocs(collection(db, "productCategories"));
    querySnapshot.forEach((doc) => {
        productCategories.push(doc.id)
    });
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
    return docSnap && docSnap.exists()
}

export const addProduct = async (data) => {
    if (!await productNameExist(data)) {
        const imgPaths = []
        const imgUrls = []
        if (data.imgList) {
            for (const img of data.imgList) {
                const storageRef = ref(storage, `products/${data.category}/${data.name}/${img.name}`);
                const res = await uploadBytes(storageRef, img, { contentType: img.type })
                imgUrls.push(await getDownloadURL(storageRef))
                imgPaths.push(res.metadata.fullPath)
            }
        }

        const docRef = await addDoc(productsRef, {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            imgLinks: imgPaths,
            imgUrls: imgUrls
        });
        return updateDoc(docRef, {
            id: docRef.id
        })
    }
}

export const updateProduct = async (data) => {
    const docRef = doc(db, `products`, data.id)
    return updateDoc(docRef, {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category
    });
}

export const deleteProduct = async (id) => {
    return await deleteDoc(doc(db, `products`, id));
}

export const getProducts = async () => {
    const products = []
    const querySnapshot = await getDocs(productsRef);
    querySnapshot.forEach((doc) => {
        const product = doc.data()
        products.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category
        })
    });
    return products
}

export const productNameExist = async (data) => {
    const q = query(productsRef, where("name", "==", data.name))
    const querySnap = await getDocs(q);
    return !querySnap.empty
}

export const productNameExistForUpdate = async (data) => {
    const q = query(productsRef, where("name", "==", data.name), where("id", "!=", data.id))
    const querySnap = await getDocs(q);
    return !querySnap.empty
}