import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../contexts/authContext'
import { useState } from 'react';
import { doSignInWithEmailAndPassword } from '../../firebase/auth'
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, Paper } from '@mui/material';
import { Navigate } from 'react-router-dom';
import LogoSide from './logoSide';
import { setUpNewUser } from '../../firebase/firestore/authentication';
import { useTranslation } from 'react-i18next';


export default function Authentication() {

    const { userLoggedIn } = useAuth()
    const { t } = useTranslation()

    const [isSigningIn, setIsSigningIn] = useState(false)
    const [signedInMessage, setsignedInMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, password).then((userCredential) => {
                // Signed in 
                setIsSigningIn(false)
                setsignedInMessage(t('loginPage').signedInMessage)
                setUpNewUser(userCredential.user)
            }).catch((error) => {
                setIsSigningIn(false)
                setErrorMessage("Invalid email or password")
            });
        }
    };

    return (<>
        {userLoggedIn ? <Navigate to={'/home'} replace={true} /> :
            <Grid container component="main" sx={{ height: '93.5vh' }}>
                {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
                <CssBaseline />
                <LogoSide />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t('email')}
                            name="email"
                            autoFocus
                            error={emailError}
                            helperText={emailError ? "Please enter a valid email" : ""}
                            onChange={(e) => {
                                setErrorMessage('')
                                setEmail(e.target.value)
                                if (!e.target.value) {
                                    setEmailError(false);
                                } else if (!validateEmail(e.target.value)) {
                                    setEmailError(true);
                                } else {
                                    setEmailError(false);
                                }
                            }}
                            inputProps={{
                                type: "email",
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={t('password')}
                            type="password"
                            id="password"
                            onChange={(event) => {
                                setPassword(event.target.value)
                                setErrorMessage('')
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={email === '' || password === '' || emailError}
                            onClick={handleSubmit}
                        >
                            {t('loginPage').login}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgotpassword" variant="body2">
                                    {t('loginPage').forgotPassword}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href={t('loginPage').signupLink} variant="body2">
                                    {t('loginPage').signup}
                                </Link>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center">
                            {isSigningIn && <CircularProgress />}
                            {signedInMessage && <Alert>{signedInMessage}</Alert>}
                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                        </Grid>
                        <Copyright sx={{ mt: 8, mb: 4 }} />
                    </Box>
                </Grid>
            </Grid>
        }
    </>
    );
}

function Copyright(props) {
    const { t } = useTranslation()

    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://littlecuteshop.com/">
                {t('websiteTitle')}
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );