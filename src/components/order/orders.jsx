import { Grid, LinearProgress, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getUserOrders } from '../../firebase/firestore/order'
import OrderCard from './orderCard'
import { useTranslation } from 'react-i18next'

export default function Orders() {

    const { t } = useTranslation()

    const [isLoading, setIsLoading] = useState(false)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        setIsLoading(true)
        async function getAndSetOrders() {
            await getUserOrders().then((os) => {
                setIsLoading(false)
                setOrders(os)
            }).catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
        }
        getAndSetOrders()
    }, [orders.length])

    return (
        <Grid container justifyContent="center" direction="column" alignItems="center">
            {isLoading && <LinearProgress />}
            <Grid item xs={1}  >
                <Typography m={2} variant="h4" >{t('order.yourOrders')}</Typography>
            </Grid>
            <OrderCard orders={orders} />
        </Grid>
    )
}