import { Grid2, LinearProgress, Typography } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getUserOrders } from '../../firebase/firestore/order'
import OrderCard from './orderCard'
import { useAuth } from '../../contexts/authContext'
import { useNavigate } from 'react-router-dom'

export default function Orders({ isCancelledOrder }) {

    const [isLoading, setIsLoading] = useState(false)
    const [orders, setOrders] = useState([])

    const lastVisibleOrder = useRef()
    const isLastPage = useRef(false)
    const observer = useRef()
    const lastOrderRef = useCallback(node => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (!isLastPage.current && entries[0].isIntersecting) {
                setIsLoading(true)
                getUserOrders(lastVisibleOrder.current, isCancelledOrder).then(([os, lastOrder, lastPage]) => {
                    orders.push(...os)
                    setIsLoading(false)
                    lastVisibleOrder.current = lastOrder
                    isLastPage.current = lastPage
                }).catch((error) => {
                    setIsLoading(false)
                    console.log(error)
                })
            }
        })
        if (node) observer.current.observe(node)
    }, [isCancelledOrder, isLoading, orders])

    const { userLoggedIn } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/home')
        }
        
        setIsLoading(true)
        async function getAndSetOrders() {
            await getUserOrders(null, isCancelledOrder).then(([os, lastOrder]) => {
                setIsLoading(false)
                setOrders(os)
                lastVisibleOrder.current = lastOrder
            }).catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
        }
        getAndSetOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Grid2 container direction="column" alignItems="center">
            <OrderCard orders={orders} lastOrderRef={lastOrderRef} />
            {isLoading && <LinearProgress />}
        </Grid2>
    )
}