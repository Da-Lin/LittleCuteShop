import { addDoc, collection, doc, getDoc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const ordersRef = collection(db, "orders");

export const addOrder = async (order, userInfo) => {
    const maxOrderId = await incrementAndGetMaxOrderId()
    order.pickUpDate = order.pickUpDate.toDate()
    order.createdDate = new Date()
    order.orderId = maxOrderId
    order.userId = auth.currentUser.uid
    order.userName = userInfo.name
    order.userEmail = userInfo.email
    order.status = "waitForConfirmation"
    return await addDoc(ordersRef, order);
}

export const incrementAndGetMaxOrderId = async () => {
    await incrementOrderId()
    const docRef = doc(db, "ids", 'orderIds');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().maxId
    }
}

export const incrementOrderId = async () => {
    const docRef = doc(db, `ids`, 'orderIds')
    return updateDoc(docRef, {
        maxId: increment(1)
    })
}

export const getUserOrders = async () => {
    const orders = []
    const q = query(ordersRef, where("userId", "==", auth.currentUser.uid), where("status", "!=", cancelledOrderStatus))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const order = doc.data()
        order.documentId = doc.id
        orders.push(order)
    });
    orders.sort((a, b) => b.orderId - a.orderId)
    console.log(orders)
    return orders
}

export const cancelOrder = (documentId) => {
    const docRef = doc(db, `orders`, documentId)
    return updateDoc(docRef, {
        status: cancelledOrderStatus
    });
}

const cancelledOrderStatus = 'cancelled'
