import React, { useState } from 'react'
import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/authContext'
import { Box, Container } from '@mui/material';
import { isAdminUser } from '../../firebase/firestore/authentication';

const Home = () => {
    const { userLoggedIn, currentUser, userPrivileges } = useAuth()
    return (
        userLoggedIn ? <div className='text-2xl font-bold pt-14'>
            Hello {isAdminUser(userPrivileges) && "Admin"} User {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
        </div>
            :
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


    )
}

export default Home