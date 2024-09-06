import { Grid, LinearProgress, Typography } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getUserOrders } from '../../firebase/firestore/order'
import OrderCard from './orderCard'
import { useTranslation } from 'react-i18next'

export default function Orders() {

    const { t } = useTranslation()

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
                getUserOrders(lastVisibleOrder.current).then(([os, lastOrder, lastPage]) => {
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
    }, [isLoading, orders])

    useEffect(() => {
        setIsLoading(true)
        async function getAndSetOrders() {
            await getUserOrders().then(([os, lastOrder]) => {
                setIsLoading(false)
                setOrders(os)
                lastVisibleOrder.current = lastOrder
            }).catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
        }
        getAndSetOrders()
    }, [])

    return (
        <Grid container justifyContent="center" direction="column" alignItems="center">
            <Grid item xs={1}  >
                <Typography m={2} variant="h4" >{t('order.yourOrders')}</Typography>
            </Grid>
            <OrderCard orders={orders} lastOrderRef={lastOrderRef} />
            {isLoading && <LinearProgress />}
        </Grid>
    )
}