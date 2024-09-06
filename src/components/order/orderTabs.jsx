import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Orders from './orders';
import { Grid2, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LabTabs() {
    const [value, setValue] = React.useState('1');

    const { t } = useTranslation()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid2 container justifyContent="center" direction="column" alignItems="center">
            <Typography m={2} variant="h5" >{t('order.yourOrders')}</Typography>
            <Box sx={{ width: '100%' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList centered onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label={t('order.orders')} value="1" />
                            <Tab label={t('order.cancelledOrders')} value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1"><Orders isCancelledOrder={false} /></TabPanel>
                    <TabPanel value="2"><Orders isCancelledOrder={true} /></TabPanel>
                </TabContext>
            </Box>
        </Grid2>
    );
}