import { Divider, Grid, LinearProgress, Typography } from '@mui/material';
import { getProduct } from '../../firebase/firestore/product';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Product() {
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [product, setProduct] = useState({})
    const [selectedImgIndex, setSelectedImgIndex] = useState(0)
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')

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

    return (<>{product &&
        < Grid container spacing={1} >
            {isLoadingProduct && <LinearProgress />}
            <Grid item sm={1}>
                <Grid container direction='column'>
                    {product.imgUrls && product.imgUrls.map((imageUrl, index) => (
                        <img key={product.name} alt='name' src={imageUrl} height={100} onClick={() => setSelectedImgIndex(index)} style={{ border: index === selectedImgIndex ? 'solid 1px blue' : 'solid 1px #eee', cursor: 'pointer' }} />
                    ))}
                </Grid>
            </Grid>
            <Grid item sm={5}>
                <img alt='name' src={product.imgUrls && product.imgUrls[selectedImgIndex]} width="100%" />
            </Grid>
            <Grid item sm={6} sx={{ whiteSpace: "pre-wrap" }}>
                <Grid container direction='column' style={{ height: '100%' }}>
                    <Typography variant='h4' gutterBottom>{product.name}</Typography>
                    <Divider />
                    <Typography variant='h5' gutterBottom >产品描述：</Typography>
                    <Typography variant='body1' gutterBottom>{product.description}</Typography>
                    <Divider />
                    <Typography variant='h5' gutterBottom>价格：{`$${parseFloat(product.price).toLocaleString('USD')}`}</Typography>
                </Grid>
            </Grid>
        </Grid >
    }
    </>
    )
}