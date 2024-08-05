import { Box, Button, Divider, Grid, LinearProgress, Typography, Link, Stack, Alert, CircularProgress } from '@mui/material';
import { getProduct } from '../../firebase/firestore/product';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import background from '../../assets/background.jpg';

export default function Product() {
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [product, setProduct] = useState({})
    const [selectedImgIndex, setSelectedImgIndex] = useState(0)
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const { t } = useTranslation()

    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn, currentUser } = useAuth()
    const emailContent = currentUser ? { subject: currentUser.email + " notifies", email: currentUser.email, message: "User wants to buy " + product.name, name: currentUser.email } : {};

    const navigate = useNavigate()

    useEffect(() => {
        setIsLoadingProduct(true)
        async function getAndSetProducts() {
            if (id) {
                await getProduct(id).then((p) => {
                    setIsLoadingProduct(false)
                    setProduct(p)
                })
                if (!product) {
                    navigate('/home')
                }
            } else {
                navigate('/home')
            }
        }
        getAndSetProducts()
        setIsLoadingProduct(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const resetMessage = () => {
        setErrorMessage('')
        setMessage('')
    }

    const sendEmail = (e) => {
        e.preventDefault();
        resetMessage()

        setIsSendingEmail(true)
        emailjs
            .send('service_rfnxvbs', 'template_6ppiony', emailContent, {
                publicKey: 'Lx8hE39ZJTFeQmYqi',
            })
            .then(
                () => {
                    setIsSendingEmail(false)
                    setMessage(t('product').notify.successfulMessage)
                },
                (error) => {
                    setIsSendingEmail(false)
                    console.log(error)
                    setErrorMessage(t('product').notify.failuerMessage)
                },
            );
    };

    const handleLoginButtonClicked = (link) => {
        navigate('/login')
    };

    return (
        <Box sx={{
            height: '100vh',
            backgroundImage: `url(${background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: 'cover'
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
                        <img alt='name' src={product.imgUrls && product.imgUrls[selectedImgIndex]} width="100%" />
                    </Grid>
                    <Grid item md={6} xl={6} sx={{ whiteSpace: "pre-wrap" }}>
                        <Grid container direction='column' style={{ height: '100%' }}>
                            <Typography variant='h4' gutterBottom>{product.name}</Typography>
                            <Divider />
                            {userLoggedIn ? <>
                                <Typography variant='h5' gutterBottom >产品描述(description)：</Typography>
                                <Typography variant='body1' gutterBottom>{product.description}</Typography>
                                <Divider />
                                <Typography variant='h5' gutterBottom>价格(Price)：{`$${parseFloat(product.price).toLocaleString('USD')}`}</Typography>
                                <Divider />
                                <Link sx={{ mt: 2 }} href="#" onClick={sendEmail} variant="body2">
                                    {t('product').notify.message}
                                </Link>
                                <Stack container justifyContent="center">
                                    {isSendingEmail && <CircularProgress />}
                                    {message && <Alert>{message}</Alert>}
                                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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