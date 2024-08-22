import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
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

    const [order, setOrder] = useState({})

    const { t } = useTranslation()

    const [openDialog, setOpenDialog] = useState(false);

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
                    if (!order['product']) {
                        order['product'] = {}
                    }
                    order['product'][product.productName] = {
                        [key]: 1
                    }
                    order['totalPrice'] = totalPrice
                    setTotalPrice(totalPrice)
                }
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart])

    const placeOrder = () => {
        if (totalPrice > 0) {
            order['pickUpDate'] = pickUpDate
            console.log(order)
            setOpenDialog(true)
        }
    }

    return (
        < Grid container direction={{ xs: "column", md: "row" }} >
            <ConfirmationDialog openDialog={openDialog} setOpenDialog={setOpenDialog} order={order} />
            <Grid item direction="column" container justifyContent="center" alignItems="center" xs={6} md={6}>
                {Object.keys(cart).sort().map(productId =>
                    <CartProductCard userCart={userCart} productId={productId} key={productId} totalPrice={totalPrice} setTotalPrice={setTotalPrice} order={order} setOrder={setOrder} />
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

function ConfirmationDialog({ openDialog, setOpenDialog, order }) {

    const { t } = useTranslation()
    const produts = order['product']

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {t('order').cart.confirmOrder}
            </DialogTitle>
            <DialogContent>
                <DialogContentText component='div' id="alert-dialog-description">
                    {produts && Object.keys(produts).sort().map((productName) =>
                        <OrderInfo key={productName} productName={productName} amounts={produts[productName]} />
                    )}
                    <Typography variant="h6" color="primary">{t('order').cart.totalPrice}:</Typography>
                    <Typography >${order.totalPrice}</Typography>
                    <Typography variant="h6" color="primary">{t('order').cart.pickUpDate}: </Typography>
                    <Typography >{order.pickUpDate && order.pickUpDate.format('YYYY-MM-DD')}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}> {t('cancel')}</Button>
                <Button onClick={handleClose} autoFocus variant="contained">{t('confirm')}</Button>
            </DialogActions>
        </Dialog>
    )
}

function OrderInfo({ productName, amounts }) {

    return (
        <>
            <Typography component='span' color="primary" variant="h6">{productName}: </Typography>
            {Object.keys(amounts).map((box) =>
                <Typography key={box}>Box in {box}: {amounts[box]}</Typography>
            )}
        </>
    )
}

