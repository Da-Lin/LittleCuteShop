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
import { Alert, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isNumber } from '../util/util';

export default function CartProductCard({ userCart, productId, totalPrice, setTotalPrice, order, setOrder, setHasError }) {

    const product = userCart[productId]
    const [price, setPrice] = useState(0)
    const [flavorCounts, setFlavorCounts] = useState(product.flavors.map(_ => 1));
    const [flavorCountErrorMessage, setFlavorCountErrorMessage] = useState("")

    useEffect(() => {
        Object.keys(product.priceMap).forEach(key => {
            if (product.amount === key) {
                const initPrice = Number(product.priceMap[key])
                setPrice(initPrice)
            }
        })

        if (order['product']) {
            let totalAmount = 0
            order['product'] && Object.keys(order['product'][product.productName]).forEach(key => {
                const amount = order['product'][product.productName][key]
                if (isNumber(key) && amount !== 0) {
                    totalAmount += key * amount
                }
            })
            const eachFlavorCount = totalAmount / product.flavors.length
            setFlavorCounts(product.flavors.map(_ => eachFlavorCount))
            if (!order['product'][product.productName]) {
                order['product'][product.productName] = {}
            }
            const initialFlavorCounts = {}
            product.flavors.forEach(flavor => {
                initialFlavorCounts[flavor] = eachFlavorCount
            })
            order['product'][product.productName]['flavors'] = initialFlavorCounts
        }
    }, [order, product])

    const { notify } = useOrder()
    const { t } = useTranslation()

    const handleFlavorCountChange = (flavor, index, e) => {

        const updatedFlavorCounts = flavorCounts.map((flavorCount, i) => {
            if (i === index) {
                if (e.target.value === '' || Number(e.target.value) < 0) {
                    order['product'][product.productName]['flavors'][flavor] = 0
                    return 0
                } else {
                    order['product'][product.productName]['flavors'][flavor] = e.target.value
                    return e.target.value
                }
            } else {
                return flavorCount
            }
        })
        setFlavorCounts(updatedFlavorCounts)
        validateTotalAmount(updatedFlavorCounts)
    };

    const validateTotalAmount = (updatedFlavorCounts) => {
        if (isTotalAmountInvalid(updatedFlavorCounts, product, order)) {
            setFlavorCountErrorMessage(t('order.cart.flavorCountMismatchError'))
            setHasError(true)
        } else {
            setFlavorCountErrorMessage('')
            setHasError(false)
        }
    }

    const removeFromCart = () => {
        const newUserCart = structuredClone(userCart);
        delete newUserCart[productId]
        updateCart(newUserCart)
            .then(() => {
                totalPrice -= price
                setTotalPrice(totalPrice)
                notify(newUserCart)
                delete order['product'][product.productName]
                setOrder(structuredClone(order))
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
                            <Amount key={priceKey} product={product} priceKey={priceKey} price={price} setPrice={setPrice} totalPrice={totalPrice} setTotalPrice={setTotalPrice} order={order} setOrder={setOrder}
                                flavorCounts={flavorCounts} setFlavorCountErrorMessage={setFlavorCountErrorMessage} setHasError={setHasError} />
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        {product.flavors && product.flavors.map((flavor, index) =>
                            <TextField
                                key={flavor}
                                error={flavorCountErrorMessage !== ''}
                                id="outlined-number"
                                label={flavor}
                                type="number"
                                value={flavorCounts[index]}
                                InputProps={{
                                    inputProps: { min: 0 }
                                }}
                                onChange={(e) => handleFlavorCountChange(flavor, index, e)}
                                sx={{ width: 100 }}
                            />
                        )}
                    </Box>
                    <IconButton aria-label="remove" onClick={removeFromCart}>
                        <DeleteIcon />
                    </IconButton>
                    {flavorCountErrorMessage && <Alert severity="error">{flavorCountErrorMessage}</Alert>}
                </CardContent>

            </Box>
        </Card>
    );
}

function Amount({ product, priceKey, price, setPrice, totalPrice, setTotalPrice, order, setOrder, flavorCounts, setFlavorCountErrorMessage, setHasError }) {

    const { t } = useTranslation()

    const [amount, setAmount] = useState(product.amount === priceKey ? 1 : 0)

    const validateTotalAmount = () => {
        if (isTotalAmountInvalid(flavorCounts, product, order)) {
            setFlavorCountErrorMessage(t('order.cart.flavorCountMismatchError'))
            setHasError(true)
        } else {
            setFlavorCountErrorMessage('')
            setHasError(false)
        }
    }

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
        validateTotalAmount()
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
            validateTotalAmount()
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

const isTotalAmountInvalid = (updatedFlavorCounts, product, order) => {
    if (!product.flavors || product.flavors.length === 0) {
        return false
    }

    let totalAmount = 0
    Object.keys(product.priceMap).forEach(key => {
        const amount = order['product'][product.productName][key]
        if (amount && isNumber(amount)) {
            totalAmount += order['product'][product.productName][key] * key
        }
    })
    const totalFlavorCount = updatedFlavorCounts.reduce((a, b) => Number(a) + Number(b), 0)
    if (totalFlavorCount !== totalAmount) {
        return true
    } else {
        return false
    }
}