import * as React from 'react';
import { Grid } from '@mui/material';
import CartProductCard from './cartProductCard';
import { useState } from 'react';
import { useOrder } from '../../contexts/orderContext';

export default function Cart() {
    const { userCart, subscibe } = useOrder()
    const [cart, setCart] = useState(userCart)
    subscibe(setCart)

    return (
        <Grid container justifyContent="center" direction="column" alignItems="center">
            {console.log(cart)}
            {Object.keys(cart).map(productId =>
                <CartProductCard userCart={userCart} productId={productId} key={productId} />
            )}
        </Grid>
    );
}