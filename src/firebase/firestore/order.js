import { addDoc, collection, doc, getDoc, increment, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import dayjs from "dayjs";
import { getCachedDocs } from "./util";

const ordersRef = collection(db, "orders");

export const addOrder = async (order, userInfo) => {
    const maxOrderId = await incrementAndGetMaxOrderId()
    order.pickUpDate = order.pickUpDate.toDate()
    order.createdDate = new Date()
    order.updatedDate = order.createdDate
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
    const docSnap = await getDoc(docRef)
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

export const getManageableOrders = async () => {
    const orders = []
    const q = query(ordersRef, where("status", "!=", CANCELLED_ORDER_STATUS), orderBy('orderId', 'desc'))
    const querySnapshot = await getCachedDocs(q, ordersRef, LAST_UPDATED_ORDER_CACHE_KEY)
    querySnapshot.forEach((doc) => {
        const order = doc.data()
        order.documentId = doc.id
        orders.push(order)
    });
    console.log(orders)
    return sortOrders(orders)
}

export const getValidOrderedProducts = async () => {
    const orders = []
    const q = query(ordersRef, where("status", "not-in", [CANCELLED_ORDER_STATUS, COMPLETE_ORDER_STATUS]), where("pickUpDate", ">=", dayjs().startOf('day').toDate()), orderBy('pickUpDate'))
    const querySnapshot = await getCachedDocs(q, ordersRef, LAST_UPDATED_ORDER_CACHE_KEY)
    querySnapshot.forEach((doc) => {
        const order = doc.data()
        order.documentId = doc.id
        orders.push(order)
    });
    console.log(orders)
    return orders
}

export const updateOrder = async (newOrders) => {
    const errors = []
    const ids = Object.keys(newOrders)
    for (const id of ids) {
        const docRef = doc(db, `orders`, id)
        await updateDoc(docRef, {
            status: newOrders[id].status,
            updatedDate: new Date()
        }).catch(err => errors.push(err));
    }
    return errors
}

export const getUserOrders = async (lastVisibleOrder, isCancelledOrder) => {
    const orders = []
    let q = query(ordersRef, where("userId", "==", auth.currentUser.uid), orderBy('orderId', 'desc'), limit(PAGE_SIZE))

    if (isCancelledOrder) {
        q = query(q, where("status", "==", CANCELLED_ORDER_STATUS))
    } else {
        q = query(q, where("status", "!=", CANCELLED_ORDER_STATUS))
    }

    if (lastVisibleOrder) {
        q = query(q, startAfter(lastVisibleOrder))
    }

    const querySnapshot = await getCachedDocs(q, ordersRef, LAST_UPDATED_ORDER_CACHE_KEY, auth.currentUser.uid)
    const isLastPage = querySnapshot.length < PAGE_SIZE
    const newLastVisibleOrder = querySnapshot[querySnapshot.length - 1];
    querySnapshot.forEach((doc) => {
        const order = doc.data()
        order.documentId = doc.id
        orders.push(order)
    });
    console.log(orders)
    return [sortOrders(orders), newLastVisibleOrder, isLastPage]
}

const PAGE_SIZE = 5

export const cancelOrder = (documentId) => {
    const docRef = doc(db, `orders`, documentId)
    return updateDoc(docRef, {
        status: CANCELLED_ORDER_STATUS,
        updatedDate: new Date()
    });
}

const sortOrders = (orders) => orders.sort((a, b) => b.orderId - a.orderId)


const CANCELLED_ORDER_STATUS = 'cancelled'
const COMPLETE_ORDER_STATUS = 'complete'
const LAST_UPDATED_ORDER_CACHE_KEY = 'lastUpdatedOrderDate'

export const MANAGEABLE_ORDER_STATUSES = [
    'confirmed',
    COMPLETE_ORDER_STATUS,
    'waitForConfirmation',
];
