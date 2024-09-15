import { getDocsFromCache, getDocsFromServer, orderBy, query, where } from "firebase/firestore";

export const getCachedDocs = async (q, docRef, lastUpdatedCacheKey) => {
    const lastUpdatedTime = localStorage.getItem(lastUpdatedCacheKey + 'Time')
    let lastUpdatedDate = new Date(Number(localStorage.getItem(lastUpdatedCacheKey)))
    if (!lastUpdatedDate || new Date() - lastUpdatedTime > CACHE_TTL) {
        lastUpdatedDate = new Date(2000, 12, 3)
    }

    const cachedSnapshot = await getDocsFromCache(q)
    if (cachedSnapshot.empty) {
        console.log('Cache is empty. Getting data from server')
        const serverSnapshot = await getDocsFromServer(q)
        if (serverSnapshot && !serverSnapshot.empty) {
            const sortedDocs = [...serverSnapshot.docs].sort((a, b) => b.data().updatedDate - a.data().updatedDate)
            localStorage.setItem(lastUpdatedCacheKey, Number(sortedDocs.docs[0].data().updatedDate.toDate()))
            localStorage.setItem(lastUpdatedCacheKey + 'Time', Number(new Date()))
        }
        return serverSnapshot.docs;
    }

    const lastUpdatedQuery = query(docRef, where("updatedDate", ">", lastUpdatedDate), orderBy('updatedDate', 'desc'))
    const newSanpshot = await getDocsFromServer(lastUpdatedQuery)
    if (!newSanpshot.empty) {
        console.log('found new data for ' + lastUpdatedCacheKey)
        const cachedDocs = [...cachedSnapshot.docs]
        localStorage.setItem(lastUpdatedCacheKey, Number(newSanpshot.docs[0].data().updatedDate.toDate()))
        localStorage.setItem(lastUpdatedCacheKey + 'Time', Number(new Date()))
        newSanpshot.forEach(newDoc => {
            const updatedIndex = cachedDocs.findIndex(doc => {
                return doc.id === newDoc.id
            })
            if (updatedIndex !== -1) {
                cachedDocs[updatedIndex] = newDoc
            } else {
                cachedDocs.push(newDoc)
            }
        })
        return cachedDocs
    }
    return cachedSnapshot.docs
}

export const restLastUpdatedCache = (key) => localStorage.setItem(key, new Date(2000, 12, 3))

const CACHE_TTL = 1000 * 60 * 60 * 12 // 12 hour