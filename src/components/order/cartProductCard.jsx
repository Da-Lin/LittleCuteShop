import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import logo from '../../assets/logo.png';
import { useState } from 'react';

export default function CartProductCard() {

    const [amount, setAmount] = useState(1)

    const handleMinus = () => {
        if (amount > 1) {
            setAmount(amount - 1)
        }
    }

    return (
        <Card sx={{ display: 'flex', mt: 2 }}>
            <CardMedia
                component="img"
                sx={{ width: 200 }}
                image={logo}
                alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography variant="h5">
                        Live From Space
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        $2
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton aria-label="previous" onClick={handleMinus}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography >
                            {amount}
                        </Typography>
                        <IconButton aria-label="next" onClick={() => setAmount(amount + 1)}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <IconButton aria-label="next" onClick={() => setAmount(amount + 1)}>
                        <DeleteIcon />
                    </IconButton>
                </CardContent>

            </Box>
        </Card>
    );
}