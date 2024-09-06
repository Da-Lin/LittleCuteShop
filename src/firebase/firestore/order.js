import { addDoc, collection, doc, getDoc, getDocs, increment, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
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
    return await addDoc(ordersRef, order).then(() => maxOrderId);
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

export const getUserOrders = async (lastVisibleOrder) => {
    const orders = []
    const q = lastVisibleOrder ? query(ordersRef, where("userId", "==", auth.currentUser.uid), where("status", "!=", cancelledOrderStatus), orderBy('orderId', 'desc'), startAfter(lastVisibleOrder), limit(PAGE_SIZE))
        : query(ordersRef, where("userId", "==", auth.currentUser.uid), where("status", "!=", cancelledOrderStatus), orderBy('orderId', 'desc'), limit(PAGE_SIZE))
    const querySnapshot = await getDocs(q);
    const isLastPage = querySnapshot.docs.length < PAGE_SIZE
    const newLastVisibleOrder = querySnapshot.docs[querySnapshot.docs.length - 1];
    querySnapshot.forEach((doc) => {
        const order = doc.data()
        order.documentId = doc.id
        orders.push(order)
    });
    console.log(orders)
    return [orders, newLastVisibleOrder, isLastPage]
}

const PAGE_SIZE = 5

export const cancelOrder = (documentId) => {
    const docRef = doc(db, `orders`, documentId)
    return updateDoc(docRef, {
        status: cancelledOrderStatus
    });
}

const cancelledOrderStatus = 'cancelled'
