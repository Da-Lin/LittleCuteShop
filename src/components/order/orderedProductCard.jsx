import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { Box, Grid2 } from '@mui/material';
import dayjs from 'dayjs';
import { OrderInfo } from './cart';

export default function OrderedProductCard({ order }) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme }) => ({
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        variants: [
            {
                props: ({ expand }) => !expand,
                style: {
                    transform: 'rotate(0deg)',
                },
            },
            {
                props: ({ expand }) => !!expand,
                style: {
                    transform: 'rotate(180deg)',
                },
            },
        ],
    }));

    return (
        <Card sx={{ width: 350 }}>
            <CardHeader subheader={order.pickUpDate} />
            <CardContent >
                {Object.keys(order.products).map(name =>
                    <Typography key={name} component='span' variant="body1" >
                        {name}:{order.products[name].qty}
                        <Grid2 direction="row" container>
                            {Object.keys(order.products[name]).length > 1 && Object.keys(order.products[name]).map(flavor =>
                                flavor !== 'qty' && <Typography key={flavor} component='span' mr={1} variant="body2" sx={{ color: 'text.secondary' }}>
                                    {flavor}: {order.products[name][flavor]}
                                </Typography>
                            )}
                        </Grid2>
                    </Typography>
                )}
            </CardContent>
            <CardActions disableSpacing>
                显示订单详情
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent >
                    {order.orders.sort((a, b) => b.orderId - a.orderId).map((order) =>
                        <Box key={order.orderId}>
                            <Typography key={order.orderId} component='span' color='green'>{order.userName}于{dayjs(order.createdDate.toDate()).format('M-D')}下单#{order.orderId}:</Typography>
                            {Object.keys(order['product']).sort().map((productName) =>
                                <OrderInfo key={productName} productName={productName} products={order['product'][productName]} />
                            )}
                        </Box>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    );
}