import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ImageUpload({ imgList, setImgList }) {
    const [imgNameList, setImgNameList] = useState([])

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        console.log(file)
        setImgNameList([...imgNameList, file.name])
        setImgList([...imgList, file])
    }

    const handleDelete = (index) => {
        setImgNameList(imgNameList.filter((id, idx, arr) => idx !== index))
        setImgList(imgList.filter((id, idx, arr) => idx !== index))
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });


    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="manage-category"
                id="managecategory"
            >
                上传该产品照片
            </AccordionSummary>
            <AccordionDetails>
                <Grid item >
                    <List dense>
                        {
                            imgNameList.map((value, index) =>
                                <ListItem key={index}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={(e) => handleDelete(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={value} />
                                </ListItem>
                            )
                        }
                    </List>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        上传照片
                        <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
                    </Button>
                </Grid>
            </AccordionDetails>
            <AccordionActions>
                {/* <Button onClick={handleAddProductCategory} disabled={categoryText === ''}>添加</Button>
                <Button onClick={handleRemoveCategoryOpen} disabled={categoryText === ''}>删除</Button> */}
            </AccordionActions>
        </Accordion>
    );
}