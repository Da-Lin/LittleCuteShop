import React from 'react'
import logo from '../../assets/logo.png';
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
                            height: 400,
                            width: 400,
                            alignItems: 'center'
                        }}
                        alt="The house from the offer."
                        src={logo}
                    />
                </Container>
        }
    </>
    )
}


export default Home