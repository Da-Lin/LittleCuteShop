import { Box, Button, Divider, Grid, LinearProgress, Typography, Stack, Alert, CircularProgress, FormControl, RadioGroup, FormControlLabel, Radio, IconButton, Tooltip } from '@mui/material';
import { getProduct } from '../../firebase/firestore/product';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useTranslation } from 'react-i18next';
import background from '../../assets/background.jpg';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { addToCart } from '../../firebase/firestore/cart';
import { useOrder } from '../../contexts/orderContext';

export default function Product() {
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [product, setProduct] = useState({})
    const [amount, setAmount] = useState(0)
    const [selectedImgIndex, setSelectedImgIndex] = useState(0)
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const { t } = useTranslation()

    const { userCart, notify } = useOrder()
    const [isAddingCart, setIsAddingCart] = useState(false)
    const [cartMessage, setCartMessage] = useState('')
    const [cartErrorMessage, setCartErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const navigate = useNavigate()
    const onePrice = (product.priceMap && Object.keys(product.priceMap).length === 1) ? product.priceMap[Object.keys(product.priceMap)[0]] : undefined

    // const price = product && parseFloat(product.price).toLocaleString('USD')
    // const discount = 0.34
    // const discountString = discount * 100 + "%"
    // const discountedPrice = Math.ceil(price * (1 - discount)).toLocaleString('USD')

    useEffect(() => {
        setIsLoadingProduct(true)
        async function getAndSetProducts() {
            if (id) {
                await getProduct(id).then((p) => {
                    setIsLoadingProduct(false)
                    setProduct(p)
                    setAmount(Object.keys(p.priceMap)[0])
                })
                setIsLoadingProduct(false)
                if (!product) {
                    navigate('/home')
                }
            } else {
                navigate('/home')
            }
        }
        getAndSetProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleLoginButtonClicked = (link) => {
        navigate('/login')
    };

    const handleAddToCart = () => {
        setCartMessage("")
        setCartErrorMessage('')
        if (userCart && product.id in userCart) {
            setCartMessage(t('product').itemAlreadyInCartMessage)
            return
        }

        setIsAddingCart(true)
        if (userCart) {
            const newItem = {
                productId: product.id,
                productName: product.name,
                imgUrl: product.imgUrls[0],
                amount: amount,
                priceMap: product.priceMap,
                flavors: product.flavors ? product.flavors : []
            }
            addToCart(newItem).then((cart) => {
                setIsAddingCart(false)
                setCartMessage(t('product').addCartSuccessfullyMessage)
                notify(cart)
            }).catch((error) => {
                setIsAddingCart(false)
                console.log(error)
                setCartErrorMessage(t('product').addCartFailedMessage)
            })
        }
    }


    return (
        <Box sx={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            height: { lg: '100vh' }
        }}>
            {product &&
                < Grid container direction={{ sm: "column", md: "row" }} >
                    {isLoadingProduct && <LinearProgress />}
                    <Grid item sm={1}>
                        <Grid container direction={{ sm: "row", md: "column" }}>
                            {product.imgUrls && product.imgUrls.map((imageUrl, index) => (
                                <img key={product.imgPaths[index]} alt='name' src={imageUrl} height='100vw'
                                    onMouseOver={() => setSelectedImgIndex(index)}
                                    onClick={() => setSelectedImgIndex(index)} style={{ border: index === selectedImgIndex ? 'solid 1px blue' : 'solid 1px #eee', cursor: 'pointer' }} />
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item md={4} xl={5}>
                        <img alt='name' src={product.imgUrls && product.imgUrls[selectedImgIndex]} width="100%" height="100%" />
                    </Grid>
                    <Grid item md={6} xl={6} sx={{ whiteSpace: "pre-wrap" }}>
                        <Grid container margin={1} direction='column' style={{ height: '100%' }}>
                            <Typography variant='h4' gutterBottom>{product.name}</Typography>
                            <Divider />
                            {userLoggedIn ? <>
                                <Typography variant='h5' gutterBottom >产品描述(description)：</Typography>
                                <Typography variant='body1' gutterBottom>{product.description}</Typography>
                                <Divider />
                                <Typography variant='h5' gutterBottom>价格(Price)：{onePrice ? `$${onePrice}` : amount && `$${product.priceMap[amount]}`}</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '& > *': {
                                            m: 1,
                                        },
                                    }}
                                >
                                    {!onePrice ?
                                        <FormControl>
                                            <RadioGroup row aria-labelledby="radio-buttons-group" name="radio-buttons-group"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}>
                                                {
                                                    product.priceMap && Object.keys(product.priceMap).map(count =>
                                                        <FormControlLabel key={count} value={count} control={<Radio checked={amount === count} />} label={count} />
                                                    )
                                                }
                                            </RadioGroup>
                                        </FormControl>
                                        : <></>}
                                </Box>
                                <Divider />
                                <Tooltip title={t('product').addToCart}>
                                    <IconButton size="large" style={{ maxWidth: '50px', justifyContent: "flex-start" }} color="primary" onClick={handleAddToCart}><AddShoppingCartIcon /></IconButton>
                                </Tooltip>
                                <Stack container justifyContent="center">
                                    {isAddingCart && <CircularProgress />}
                                    {cartMessage && <Alert>{cartMessage}</Alert>}
                                    {cartErrorMessage && <Alert severity="error">{cartErrorMessage}</Alert>}
                                </Stack>
                            </> :
                                <>
                                    <Button style={{ maxWidth: '400px', justifyContent: "flex-start" }} color="primary" onClick={handleLoginButtonClicked} >{t('product').loginMessage}</Button>
                                </>
                            }
                        </Grid>
                    </Grid>
                </Grid >
            }
        </Box>
    )
}