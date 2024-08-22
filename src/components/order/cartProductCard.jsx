import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useOrder } from '../../contexts/orderContext';
import { updateCart } from '../../firebase/firestore/cart';
import { useEffect } from 'react';

export default function CartProductCard({ userCart, productId, totalPrice, setTotalPrice, order, setOrder }) {

    const product = userCart[productId]
    const [price, setPrice] = useState(0)

    useEffect(() => {
        Object.keys(product.priceMap).forEach(key => {
            if (product.amount === key) {
                const initPrice = Number(product.priceMap[key])
                setPrice(initPrice)
            }
        });
    }, [product])

    const { notify } = useOrder()

    const removeFromCart = () => {
        const newUserCart = structuredClone(userCart);
        delete newUserCart[productId]
        updateCart(newUserCart)
            .then(() => {
                totalPrice -= price
                setTotalPrice(totalPrice)
                notify(newUserCart)
                delete order['product'][product.productName]
                setOrder(order)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Card sx={{ display: 'flex', mt: 2, width: 600 }}>
            <CardMedia
                component="img"
                sx={{ width: 200 }}
                image={product.imgUrl}
                alt="Product Image"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography color="primary" variant="h5">
                        {product.productName}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        ${price}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {Object.keys(product.priceMap).map(priceKey =>
                            <Amount key={priceKey} product={product} priceKey={priceKey} price={price} setPrice={setPrice} totalPrice={totalPrice} setTotalPrice={setTotalPrice} order={order} setOrder={setOrder} />
                        )}
                    </Box>
                    <IconButton aria-label="remove" onClick={removeFromCart}>
                        <DeleteIcon />
                    </IconButton>
                </CardContent>

            </Box>
        </Card>
    );
}

function Amount({ product, priceKey, price, setPrice, totalPrice, setTotalPrice, order, setOrder }) {
    const [amount, setAmount] = useState(product.amount === priceKey ? 1 : 0)

    const handleAdd = () => {
        setPrice(Number(price) + Number(product.priceMap[priceKey]))
        setAmount(amount + 1)
        const newPrice = totalPrice + Number(product.priceMap[priceKey])
        setTotalPrice(newPrice)

        if (!order['product'][product.productName]) {
            order['product'][product.productName] = {}
        }
        order['product'][product.productName][priceKey] = amount + 1
        order['totalPrice'] = newPrice
        setOrder(order)
    }

    const handleMinus = () => {
        if (amount >= 1) {
            setPrice(Number(price) - Number(product.priceMap[priceKey]))
            setAmount(amount - 1)
            const newPrice = totalPrice - Number(product.priceMap[priceKey])
            setTotalPrice(newPrice)

            order['product'][product.productName][priceKey] = amount - 1
            order['totalPrice'] = newPrice
            setOrder(order)
        }
    }

    return (
        <Typography variant="subtitle" color="text.secondary" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            Box in {priceKey}
            <IconButton aria-label="previous" onClick={handleMinus}>
                <RemoveIcon />
            </IconButton>
            <Typography >
                {amount}
            </Typography>
            <IconButton aria-label="next" onClick={handleAdd}>
                <AddIcon />
            </IconButton>
        </Typography>
    )
}