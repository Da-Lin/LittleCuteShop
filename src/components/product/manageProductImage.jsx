import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ManageProductImage({ rowData, imgList, setImgList }) {
    const [imgNameList, setImgNameList] = useState(rowData.imgPaths.map((imgPath => imgPath.split('/').pop())))
    const [existingImgNames, setExistingImgNames] = useState(rowData.imgPaths.map((imgPath => imgPath.split('/').pop())))
    const [imgErrorMessage, setImgErrorMessage] = useState('');

    const validImgType = ['image/jpeg', 'image/png', 'image/svg+xml']
    const IMG_NAMES_TO_DELETE = "imgNamesToDelete"

    useEffect(() => {
        rowData[IMG_NAMES_TO_DELETE] = []
    }, [rowData])

    const handleFileUpload = (e) => {
        setImgErrorMessage('')
        const file = e.target.files[0]
        if (!validImgType.includes(file.type)) {
            setImgErrorMessage("图片格式不对，当前仅支持jpeg, png, svg")
            return;
        }
        if (imgNameList.includes(file.name)) {
            setImgErrorMessage("图片名字已经存在")
            return;
        }
        setImgNameList([...imgNameList, file.name])
        setImgList([...imgList, file])
    }

    const handleDelete = (index) => {
        console.log(imgNameList[index])
        const imgNameToDelete = imgNameList[index]
        if (!rowData[IMG_NAMES_TO_DELETE].includes(imgNameToDelete) && existingImgNames.includes(imgNameToDelete)) {
            setExistingImgNames(existingImgNames.filter(existingImgName => existingImgName !== imgNameToDelete))
            rowData[IMG_NAMES_TO_DELETE].push(imgNameToDelete)
        }
        setImgErrorMessage('')
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

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="manage-category"
                id="managecategory"
            >
                修改产品照片
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
            {imgErrorMessage && <Alert severity="error">{imgErrorMessage}</Alert>}
        </Accordion>
    );
}