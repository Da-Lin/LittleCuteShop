import { collection, query, getDocs, where, documentId, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

class User {
    constructor(id, email) {
        this.id = id;
        this.email = email;
    }
    toString() {
        return this.id + ', ' + this.email;
    }
}

// Firestore data converter
const userConverter = {
    toFirestore: (user) => {
        return {
            id: user.id,
            email: user.email,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.id, data.email);
    }
};

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

export const getUserPrivileges = async (user) => {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    const privilegeIds = await userPrivilegeIds(docSnap.data().roleIds)
    return await userPrivilegeNames(privilegeIds)
};

export const isAdmin = (privileges) => privileges && privileges.includes("admin")
