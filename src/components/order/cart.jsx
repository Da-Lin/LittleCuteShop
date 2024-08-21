import * as React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import CartProductCard from './cartProductCard';
import { useState } from 'react';
import { useOrder } from '../../contexts/orderContext';
import { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function Cart() {
    const { userCart, subscibe } = useOrder()
    const [cart, setCart] = useState(userCart)
    subscibe(setCart)
    const [totalPrice, setTotalPrice] = useState(0)

    const [pickUpDate, setPickUpDate] = useState(dayjs().add(2, 'day'));
    const [pickUpDateError, setPickUpDateError] = useState('');

    const { t } = useTranslation()

    const pickUpDateErrorMessage = useMemo(() => {
        switch (pickUpDateError) {
            case 'maxDate':
            case 'minDate': {
                return t('order').cart.pickUpDateError;
            }

            case 'invalidDate': {
                return 'Your date is not valid';
            }

            default: {
                return '';
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickUpDateError]);

    useEffect(() => {
        let totalPrice = 0
        Object.keys(cart).forEach(productId => {
            const product = cart[productId]
            Object.keys(product.priceMap).forEach(key => {
                if (product.amount === key) {
                    totalPrice += Number(product.priceMap[key])
                    setTotalPrice(totalPrice)
                }
            })
        })

    }, [cart])

    const placeOrder = () => {
        if (totalPrice > 0) {

        }
    }

    return (
        < Grid container direction={{ xs: "column", md: "row" }} >
            <Grid item direction="column" container justifyContent="center" alignItems="center" xs={6} md={6} minWidth={600}>
                {Object.keys(cart).map(productId =>
                    <CartProductCard userCart={userCart} productId={productId} key={productId} totalPrice={totalPrice} setTotalPrice={setTotalPrice} />
                )}
            </Grid>
            <Grid item container xs={6} md={6} justifyContent={{ xs: "center", md: "start" }} >
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }} minWidth={300}>
                    <Typography sx={{ mt: 2 }}>{t('order').cart.totalPrice}: ${totalPrice}</Typography>
                    <DatePicker
                        label={t('order').cart.pickUpDate} sx={{ mt: 2 }}
                        onError={(newError) => setPickUpDateError(newError)}
                        slotProps={{
                            textField: {
                                helperText: pickUpDateErrorMessage,
                            },
                        }}
                        value={pickUpDate}
                        minDate={dayjs().add(2, 'day')}
                        onChange={(newDate) => setPickUpDate(newDate)}
                    />
                    <Button sx={{ mt: 2 }} disabled={pickUpDateError !== "" || totalPrice <= 0} onClick={placeOrder}>{t('order').cart.placeOrder}</Button>
                </Box>
            </Grid>
        </Grid >
    );
}