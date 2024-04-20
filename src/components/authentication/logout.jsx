import { useNavigate } from 'react-router-dom'
import { doSignOut } from '../../firebase/auth'
import React from 'react'

export default function Logout() {
    const navigate = useNavigate()
    doSignOut().then(() => { navigate('/home') })

    return (<></>)
}