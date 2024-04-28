import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'react-router-dom';
import { getCategoryProducts } from '../../firebase/firestore/product';

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 300,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
    },
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));

export default function Products() {
    const [products, setProducts] = useState([])
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)

    const [searchParams] = useSearchParams();
    const category = searchParams.get('category')

    useEffect(() => {
        async function getAndSetProducts() {
            setIsLoadingProducts(true)
            await getCategoryProducts(category).then((ps) => {
                setIsLoadingProducts(false)
                setProducts(ps)
            }).catch((error) => {
                setIsLoadingProducts(false)
                console.log(error)
            })
        }
        getAndSetProducts()
    }, [category])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%' }}>
            {console.log(!!products)}
            {products.length === 0 && <Typography variant="h3" align='center' sx={{ width: '100%' }}>暂时没有该产品，敬请期待！</Typography>}
            {products.map((product) => (
                <ImageButton
                    focusRipple
                    key={product.name}
                    style={{
                        width: '33.3333%',
                        minHeight: '100'
                    }}
                >
                    <ImageSrc style={{ backgroundImage: product.imgUrls ? `url(${product.imgUrls[0]})` : null }} />
                    <ImageBackdrop className="MuiImageBackdrop-root" />
                    <Image>
                        <Typography
                            component="span"
                            variant="subtitle1"
                            color="inherit"
                            sx={{
                                position: 'relative',
                                p: 4,
                                pt: 2,
                                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                            }}
                        >
                            {product.name}
                            <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                    </Image>
                </ImageButton>
            ))}
        </Box>
    );
}