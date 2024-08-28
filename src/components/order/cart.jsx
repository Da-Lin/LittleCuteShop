import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, LinearProgress, TextField, Typography } from '@mui/material';
import CartProductCard from './cartProductCard';
import { useState } from 'react';
import { useOrder } from '../../contexts/orderContext';
import { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { addOrder } from '../../firebase/firestore/order';
import { useNavigate } from 'react-router-dom';
import { deleteCart } from '../../firebase/firestore/cart';
import { isNumber } from '../util/util';
import { useAuth } from '../../contexts/authContext';
import { ses } from '../../aws/aws';

export default function Cart() {
    const { userCart, subscibe } = useOrder()
    const [cart, setCart] = useState(userCart)
    subscibe(setCart)
    const [totalPrice, setTotalPrice] = useState(0)

    const [pickUpDate, setPickUpDate] = useState(dayjs().add(2, 'day'));
    const [pickUpDateError, setPickUpDateError] = useState('');
    const [hasError, setHasError] = useState(false)

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
                        [key]: 1,
                        productId: product.productId
                    }
                    order['totalPrice'] = totalPrice
                    setOrder(structuredClone(order))
                    setTotalPrice(totalPrice)
                }
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart])

    const placeOrder = () => {
        if (totalPrice > 0) {
            order['pickUpDate'] = pickUpDate
            setOpenDialog(true)
        }
    }

    return (
        < Grid container direction={{ xs: "column", md: "row" }} >
            <ConfirmationDialog openDialog={openDialog} setOpenDialog={setOpenDialog} order={order} />
            <Grid item direction="column" container justifyContent="center" alignItems="center" xs={6} md={6}>
                {Object.keys(cart).sort().map(productId =>
                    <CartProductCard userCart={userCart} productId={productId} key={productId} totalPrice={totalPrice} setTotalPrice={setTotalPrice} order={order} setOrder={setOrder} setHasError={setHasError} />
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
                    <Button sx={{ mt: 2 }} disabled={hasError || pickUpDateErrorMessage !== "" || totalPrice <= 0} onClick={placeOrder}>{t('order').cart.placeOrder}</Button>
                </Box>
            </Grid>
        </Grid >
    );
}

function ConfirmationDialog({ openDialog, setOpenDialog, order }) {

    const { t, i18n } = useTranslation()
    const isChinese = i18n.language === 'zh'

    const navigate = useNavigate();
    const { notify } = useOrder()

    const [isAddingOrder, setIsAddingOrder] = useState(false)
    const produts = order['product']

    const { userInfo } = useAuth()

    const BODY_TEXT = isChinese ? `尊敬的${userInfo.name},<br><br>感谢您使用我们网站购买产品！您将会在订单被确认后收到通知。如果您有任何问题可直接回复此邮件<br><br>此致，<br>Little Cute Shop` :
        `Dear ${userInfo.name},<br><br>Thanks for shopping with us! You will be notified once your order is confirmed by us. Feel free to reply to this email if you have any questions.<br><br>Best regards,<br>Little Cute Shop`

    const getBuyerEmailContent = (orderId) => {
        return {
            Source: "Little Cute Shop <littlecuteshop2024@gmail.com>",
            Destination: {
                ToAddresses: [userInfo.email]
            },
            Message: {
                Subject: {
                    Data: isChinese ? `感谢下单 - 订单号码：${orderId}` :
                        `Thanks for Placing the Order - Order Number ${orderId}`
                },
                Body: {
                    Html: {
                        Data: BODY_TEXT
                    }
                }
            }
        }
    }

    const getSellerEmailContent = (orderId) => {
        return {
            Source: "Little Cute Shop <littlecuteshop2024@gmail.com>",
            Destination: {
                ToAddresses: ["xiaokeairong@gmail.com"]
            },
            Message: {
                Subject: {
                    Data: `New Order Placed by ${userInfo.name} - Order Number ${orderId}`
                },
                Body: {
                    Html: {
                        Data: `User email: ${userInfo.email}`
                    }
                }
            }
        }
    }

    const handleAddOrder = () => {
        setIsAddingOrder(true)
        addOrder(order, userInfo).then((orderId) => {
            setIsAddingOrder(false)
            ses.sendEmail(getBuyerEmailContent(orderId), (error, data) => {
                if (error) {
                    console.log(error)
                }
            })
            ses.sendEmail(getSellerEmailContent(orderId), (error, data) => {
                if (error) {
                    console.log(error)
                }
            })
            deleteCart().then(() => {
                notify({})
            }).catch((error) => {
                console.log(error)
            })
            navigate('/orders')
        }).catch((error) => {
            setIsAddingOrder(false)
            console.log(error)
        })
    }

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
            {isAddingOrder && <LinearProgress />}
            <DialogTitle id="alert-dialog-title">
                {t('order').cart.confirmOrder}
            </DialogTitle>
            <DialogContent>
                <DialogContentText component='div' id="alert-dialog-description">
                    {produts && Object.keys(produts).sort().map((productName) =>
                        <OrderInfo key={productName} productName={productName} products={produts[productName]} />
                    )}
                    <Typography variant="h6" color="primary">{t('order').cart.totalPrice}:</Typography>
                    <Typography >${order.totalPrice}</Typography>
                    <Typography variant="h6" color="primary">{t('order').cart.pickUpDate}: </Typography>
                    <Typography >{order.pickUpDate && order.pickUpDate.format && order.pickUpDate.format('YYYY-MM-DD')}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}> {t('cancel')}</Button>
                <Button onClick={handleAddOrder} autoFocus variant="contained">{t('confirm')}</Button>
            </DialogActions>
        </Dialog>
    )
}

export function OrderInfo({ productName, products }) {

    const { t } = useTranslation()

    let productId = ""
    let amounts = []
    let flavors = {}
    Object.keys(products).forEach((key) => {
        if (isNumber(key)) {
            amounts.push(key)
        } else if (key === 'productId') {
            productId = products[key]
        } else if (key === 'flavors') {
            flavors = products[key]
        }
    })

    const navigate = useNavigate();

    return (
        <Box>
            <Typography sx={{
                '&:hover': {
                    cursor: 'pointer',
                    color: "red",
                    textDecoration: "underline #000000"
                }
            }} component='span' color="primary" variant="h6" onClick={() => navigate(`/product?id=${productId}`)}>{productName}: </Typography>
            {amounts.map((box) =>
                <Typography key={box}>Box in {box}: {products[box]}</Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {flavors && Object.keys(flavors).map(flavor =>
                    flavors[flavor] && Number(flavors[flavor]) !== 0 && <Typography key={flavor} mr={1}>{t(flavor)}: {flavors[flavor]}</Typography>
                )}
            </Box>
        </Box>
    )
}

