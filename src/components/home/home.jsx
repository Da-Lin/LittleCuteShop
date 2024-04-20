import React from 'react'
import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/authContext'
import { Box, Container } from '@mui/material';

const Home = () => {
    const { userLoggedIn, currentUser } = useAuth()
    return (
        userLoggedIn ? <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div>
            :
            <Container component="main" maxWidth="xs">
                <Box
                    component="img"
                    sx={{
                        marginTop: 8,
                        height: 500,
                        width: 500,
                        alignItems: 'center'
                    }}
                    alt="The house from the offer."
                    src={logo}
                />
            </Container>


    )
}

export default Home