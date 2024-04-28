import { collection, query, getDocs, where, setDoc, addDoc, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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
            imgPaths: imgPaths,
            imgUrls: imgUrls
        });
        return updateDoc(docRef, {
            id: docRef.id
        })
    }
}

export const updateProduct = async (data) => {
    const imgPaths = []
    const imgUrls = []
    const imgNamesToDelete = data.imgNamesToDelete
    const existingImgNames = data.imgPaths.map((imgPath => imgPath.split('/').pop())).filter(imgName => !imgNamesToDelete.includes(imgName))

    data.imgPaths.forEach(imgPath => {
        const savedImgName = imgPath.split('/').pop()
        if (existingImgNames.includes(savedImgName)) {
            imgPaths.push(imgPath)
        }
    })

    data.imgUrls.forEach(imgUrl => {
        for (let existingImgName of existingImgNames) {
            if (imgUrl.includes(existingImgName)) {
                imgUrls.push(imgUrl)
                continue
            }
        }
    })

    if (imgNamesToDelete) {
        for (const imgName of imgNamesToDelete) {
            const storageRef = ref(storage, `products/${data.category}/${data.name}/${imgName}`);
            await deleteObject(storageRef)
        }
    }

    if (data.imgList) {
        for (const img of data.imgList) {
            const storageRef = ref(storage, `products/${data.category}/${data.name}/${img.name}`);
            const res = await uploadBytes(storageRef, img, { contentType: img.type })
            imgUrls.push(await getDownloadURL(storageRef))
            imgPaths.push(res.metadata.fullPath)
        }
    }

    const docRef = doc(db, `products`, data.id)
    return updateDoc(docRef, {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imgPaths: imgPaths,
        imgUrls: imgUrls
    });
}

export const deleteProduct = async (data) => {
    for (const imgPath of data.imgPaths) {
        const storageRef = ref(storage, imgPath);
        await deleteObject(storageRef)
    }

    return await deleteDoc(doc(db, `products`, data.id));
}

export const getProduct = async (id) => {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    }
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
            category: product.category,
            imgPaths: product.imgPaths,
            imgUrls: product.imgUrls
        })
    });
    return products
}

export const getCategoryProducts = async (category) => {
    const products = []
    const q = query(productsRef, where("category", "==", category))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const product = doc.data()
        products.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imgPaths: product.imgPaths,
            imgUrls: product.imgUrls
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