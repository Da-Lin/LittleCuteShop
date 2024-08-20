import React, { useContext, useState, useEffect } from "react";
import { getCart } from "../firebase/firestore/cart";

const OrderContext = React.createContext(null);

export function useOrder() {
    return useContext(OrderContext);
}

export function OrderProvider({ children }) {
    const [userCart, setUserCart] = useState({})
    const [isLoading, setIsLoading] = useState({})
    const subscribers = []


    const subscibe = (subSriber) => {
        subscribers.push(subSriber)
    }

    const notify = (newCart) => {
        subscribers.forEach(subSriber => {
            setUserCart(newCart)
            subSriber(newCart)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        loadCart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadCart = () => {
        getCart().then((cart) => {
            if (cart !== undefined) {
                setUserCart(cart)
                notify(cart)
            }
            setIsLoading(false)
        }).catch((error) => {
            setIsLoading(false)
            console.log(error)
        })
    }

    const value = {
        userCart,
        setUserCart,
        subscibe,
        notify,
        loadCart
    };

    return (
        <OrderContext.Provider value={value}>
            {!isLoading && children}
        </OrderContext.Provider>
    );
}