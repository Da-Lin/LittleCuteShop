import { collection, query, getDocs, where, documentId, getDoc, doc, setDoc, getCountFromServer } from "firebase/firestore";
import { db } from "../firebase";

const userPrivilegeNames = async (userPrivilegeIds) => {
    const userPrivileges = []
    const q = query(collection(db, "privileges"), where(documentId(), 'in', userPrivilegeIds))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        userPrivileges.push(doc.data().name)
    });
    return userPrivileges
};

const userPrivilegeIds = async (userRoleIds) => {
    const userPrivilegeIds = []
    for (const userRoleId of userRoleIds) {
        const docSnap = await getDoc(doc(db, "roles", userRoleId));
        userPrivilegeIds.push(...docSnap.data().privilegeIds)
    }
    return userPrivilegeIds
};

export const getUserName = async (user) => {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (!docSnap.data()) {
        return ""
    }
    return docSnap.data().name
};

export const getUserPrivileges = async (user) => {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (!docSnap.data()) {
        return []
    }
    const privilegeIds = await userPrivilegeIds(docSnap.data().roleIds)
    return await userPrivilegeNames(privilegeIds)
};

export const setUpNewUser = async (user) => {
    if (!await userExists(user.uid)) {
        await setDoc(doc(collection(db, "users"), user.uid), {
            email: user.email,
            name: "",
            roleIds: [`${CLINET_ROLE_ID}`]
        })
    }
};

export const userExists = async (id) => {
    const snap = await getCountFromServer(query(collection(db, 'users'), where(documentId(), '==', id)))
    return !!snap.data().count
}

export const isAdmin = (privileges) => privileges && privileges.includes("admin")

const CLINET_ROLE_ID = 2