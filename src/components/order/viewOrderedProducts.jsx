import * as React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { getValidOrderedProducts } from '../../firebase/firestore/order';
import { Alert, Grid2, LinearProgress } from '@mui/material';
import dayjs from 'dayjs';
import { isNumber } from '../util/util';
import OrderedProductCard from './orderedProductCard';

export default function OrderedProducts() {
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [isLoadingOrderError, setIsLoadingOrderError] = useState(false);
    const [orders, setOrders] = useState([])

    const { userInfo } = useAuth()
    const navigate = useNavigate()

    const aggregateOrders = (orders) => {
        const aggregatedOrders = []
        const groupedOrders = Object.groupBy(orders, ({ pickUpDate }) => dayjs(pickUpDate.toDate()).format('dddd, MMMM D'))
        Object.keys(groupedOrders).forEach(date => {
            const ordersOnSameDate = groupedOrders[date]
            const aggregatedOrder = { pickUpDate: date, orders: ordersOnSameDate, products: {} }
            ordersOnSameDate.forEach(order => {
                const products = order['product']
                Object.keys(products).sort().forEach(name => {
                    if (!aggregatedOrder['products'][name]) {
                        aggregatedOrder['products'][name] = { qty: 0 }
                    }
                    const product = products[name]
                    Object.keys(product).sort().forEach(key => {
                        if (isNumber(key)) {
                            if (name.includes('点心礼盒')) {
                                aggregatedOrder['products'][name].qty += product[key]
                            } else {
                                aggregatedOrder['products'][name].qty += product[key] * key
                            }
                        } else if (key === 'flavors') {
                            const flavors = product[key]
                            Object.keys(flavors).sort().forEach(flavor => {
                                if (!aggregatedOrder['products'][name][flavor]) {
                                    aggregatedOrder['products'][name][flavor] = 0
                                }
                                aggregatedOrder['products'][name][flavor] += Number(product[key][flavor])
                            })
                        }
                    })
                })
            })
            aggregatedOrders.push(aggregatedOrder)
        })
        return aggregatedOrders
    }

    useEffect(() => {
        if (!userInfo.isAdmin) {
            navigate('/home')
        }

        async function getAndSetOrders() {
            setIsLoadingOrder(true)
            await getValidOrderedProducts().then((os) => {
                setIsLoadingOrder(false)
                aggregateOrders(os)
                setOrders(aggregateOrders(os))
            }).catch((error) => {
                setIsLoadingOrder(false)
                setIsLoadingOrderError(true)
                console.log(error)
            })
        }
        getAndSetOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <Grid2 direction="row" container alignItems="flex-start" >
            {isLoadingOrder && <LinearProgress />}
            {isLoadingOrderError && <Alert severity="error">Cannot load orders</Alert>}
            {orders.map(order =>
                <OrderedProductCard key={order.pickUpDate} order={order} />
            )}
        </Grid2 >
    );
}