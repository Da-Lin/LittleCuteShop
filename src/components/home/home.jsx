import React from 'react'
import logo from '../../logo.png';
import { useAuth } from '../../contexts/authContext'

const Home = () => {
    const { userLoggedIn, currentUser } = useAuth()
    return (
        userLoggedIn ? <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div>
            :
            <div className="flex w-full h-screen justify-center items-center">
                <img src={logo}  className="w-96 my-20 place-items-center" alt="logo" />
            </div>

    )
}

export default Home