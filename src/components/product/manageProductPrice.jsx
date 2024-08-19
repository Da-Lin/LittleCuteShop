import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Grid, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material'

export default function ManageProductPrice({ rowData, priceMap, setPriceMap, priceValidationError, setPriceValidationError }) {

    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (rowData && rowData.priceMap) {
            setPriceMap(rowData.priceMap)
        } else if (Object.keys(priceMap).length === 0) {
            setPriceMap({})
        }
        if (Object.keys(priceMap).length === 0) {
            setPriceValidationError('请输入产品价格')
        } else {
            setPriceValidationError('')
        }
    })

    const handleAddPrice = () => {
        priceMap[amount] = price
        setPriceMap({ ...priceMap })
        setPriceValidationError('')
    }

    const handleRemovePrice = (amount) => {
        delete priceMap[amount]
        setPriceMap({ ...priceMap })
        if (Object.keys(priceMap).length === 0) {
            setPriceValidationError('请输入产品价格')
        }
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="manage-category"
                id="managecategory"
            >
                管理产品价格
            </AccordionSummary>
            <AccordionDetails>
                <List dense>
                    {
                        Object.keys(priceMap).map(amount =>
                            <ListItem key={amount}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={(e) => handleRemovePrice(amount)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={`${amount}-$${priceMap[amount]}`} />
                            </ListItem>
                        )
                    }
                </List>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            type="number"
                            required
                            name="amount"
                            label="数量"
                            id="amount"
                            onChange={(e) => setAmount((e.target.value))}
                            InputProps={{
                                inputProps: { min: 1 }
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            type='number'
                            margin="normal"
                            required
                            name="price"
                            label="价格"
                            id="price"
                            onChange={(e) => setPrice((e.target.value))}
                            InputProps={{
                                inputProps: { min: 1 }
                            }}
                        />
                    </Grid>
                </Grid>
            </AccordionDetails>
            <AccordionActions>
                <Button onClick={handleAddPrice} disabled={!amount || !price || amount <= 0 || price <= 0}>添加</Button>
            </AccordionActions>
            {/* {manageCategoryIsLoading && <CircularProgress />}
            {manageCategoryMessage && <Alert >{manageCategoryMessage}</Alert>}
            {manageCategoryErrorMessage && <Alert severity="error">{manageCategoryErrorMessage}</Alert>} */}
        </Accordion>
    )
}