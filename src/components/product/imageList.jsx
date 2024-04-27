import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { createTheme, useMediaQuery } from '@mui/material';

export default function ProdictImageList({ rowData }) {
    const theme = createTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <ImageList sx={{ width: matchDownMd ? 480 : null, height: matchDownMd ? 450 : null }} rowHeight={matchDownMd ? '164' : 'auto'}>
            {rowData.imgUrls.map((imgUrl) => (
                <ImageListItem key={imgUrl}>
                    <img
                        src={imgUrl}
                        alt={rowData.name}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}