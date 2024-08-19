import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import logo from '../../assets/logo.png';
import { Grid, LinearProgress } from '@mui/material';
import CartProductCard from './cartProductCard';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { getCategoryProducts } from '../../firebase/firestore/product';
import { getCart } from '../../firebase/firestore/order';
import { useAuth } from '../../contexts/authContext';
import { useMemo, cache } from 'react';
import { useOrder } from '../../contexts/orderContext';

export default function Cart() {

    const { userCart } = useOrder()

    return (
        <Grid container justifyContent="center" direction="column" alignItems="center">
            {Object.keys(userCart).map(productId =>
                <CartProductCard userCart={userCart} productId={productId} />
            )}
        </Grid>
    );
}