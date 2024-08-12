import React from 'react'
import menu from '../../assets/menu.jpg';
import { useAuth } from '../../contexts/authContext'
import { Box, Container } from '@mui/material';
import { Navigate } from 'react-router-dom';

const Home = () => {
    const { userLoggedIn, userInfo } = useAuth()

    return (<>
        {
            userLoggedIn && userInfo.isAdmin ? <Navigate to={'/manageproducts'} replace={true}></Navigate> :
                <Container component="main" maxWidth="xs">
                    <Box
                        component="img"
                        sx={{
                            marginTop: 8,
                            height: 700,
                            width: 400,
                            alignItems: 'center'
                        }}
                        alt="logo"
                        src={menu}
                    />
                </Container>
        }
    </>
    )
}


export default Home