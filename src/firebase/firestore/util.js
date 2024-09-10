import { getDocFromCache, getDocFromServer, getDocsFromCache, getDocsFromServer } from "firebase/firestore";

export const getCachedDoc = (docRef) =>
    getDocFromCache(docRef).then(doc => {
        if (doc.empty) {
            console.log('Cache is empty. Getting data from server')
            return getDocFromServer(docRef);
        } else {
            return doc
        }
    }).catch(() => {
        console.log('Cache is not enabled. Getting data from server')
        return getDocFromServer(docRef)
    })

export const getCachedDocs = (q) =>
    getDocsFromCache(q).then(snapshot => {
        if (snapshot.empty) {
            console.log('Orders cache is empty. Getting orders from server')
            return getDocsFromServer(q);
        } else {
            return snapshot
        }
    }).catch(() => {
        console.log('Cache is not enabled. Getting orders from server')
        return getDocsFromServer(q)
    })