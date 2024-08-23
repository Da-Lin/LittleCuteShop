import { Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogTitle, Grid, IconButton, LinearProgress, Popover, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { OrderInfo } from './cart'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import CancelIcon from '@mui/icons-material/Cancel';
import { cancelOrder } from '../../firebase/firestore/order'

export default function OrderCard({ orders }) {

    const { t } = useTranslation()

    const [openDialog, setOpenDialog] = useState(false);
    const [documentId, setDocumentId] = useState();

    const handleOpenDialog = (documentId) => {
        setDocumentId(documentId)
        setOpenDialog(true)
    }

    return (
        <Grid item xs={1} >
            <CancelDialog openDialog={openDialog} setOpenDialog={setOpenDialog} documentId={documentId} orders={orders} />
            {orders.map((order) =>
                <Card key={order.orderId} sx={{ display: 'flex', mt: 2, width: 600 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography variant="body2">
                                {t('order.orderNumber')}: {order.orderId}
                            </Typography>
                            {order['product'] && Object.keys(order['product']).sort().map((productName) =>
                                <OrderInfo key={productName} productName={productName} products={order['product'][productName]} />
                            )}
                            <Typography variant="h6" color="primary">{t('order').cart.totalPrice}:</Typography>
                            <Typography >${order.totalPrice}</Typography>
                            <Typography variant="h6" color="primary">{t('order').cart.pickUpDate}: </Typography>
                            <Typography >{dayjs(order.pickUpDate.toDate()).format('YYYY-MM-DD')}</Typography>
                            <Typography variant="h6" color="primary">{t('order.orderStatus')}:<OrderStatusPopover /></Typography>
                            {order.status === "confirmed" ?
                                <Typography color="green">{t('order.' + order.status)}</Typography>
                                : <Typography color="red">{t('order.' + order.status)}</Typography>}

                        </CardContent>
                        <CardActions>
                            {order.status !== "confirmed" && <Tooltip title={t('order').cancelOrder}>
                                <IconButton aria-label="add to favorites" onClick={() => handleOpenDialog(order.documentId)}>
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>}
                        </CardActions>
                    </Box>
                </Card>
            )}
        </Grid>
    )
}

function CancelDialog({ openDialog, setOpenDialog, documentId, orders }) {

    const { t } = useTranslation()

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setOpenDialog(false)
    };

    const handleCancelOrder = () => {
        setIsLoading(true)
        cancelOrder(documentId).then(() => {
            for (var i = orders.length - 1; i >= 0; i--) {
                if (orders[i].documentId === documentId) {
                    orders.splice(i, 1);
                    break
                }
            }
            console.log(orders.length)
            setOpenDialog(false)
        }).catch((error) => {
            setIsLoading(false)
            console.log(error)
        })
    }


    return (
        <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {isLoading && <LinearProgress />}
            <DialogTitle id="alert-dialog-title">
                {t('order.cancelOrderConfirmation')}
            </DialogTitle>
            <DialogActions>
                <Button onClick={handleClose} >{t('cancel')}</Button>
                <Button onClick={handleCancelOrder} autoFocus>
                    {t('confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function OrderStatusPopover() {

    const { t } = useTranslation()

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ display: 'inline' }}>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                sx={{ display: 'inline' }}
            >
                (?)
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>{t('order.waitOrderStatusExplanation')}</Typography>
                <Typography sx={{ p: 1 }}>{t('order.confirmedOrderStatusExplanation')}</Typography>
            </Popover>
        </Box>
    );
}