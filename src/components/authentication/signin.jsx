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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../contexts/authContext'
import { useState } from 'react';
import { doSignInWithEmailAndPassword } from '../../firebase/auth'
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, Paper } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import LogoSide from './logoSide';

const defaultTheme = createTheme();

export default function Authentication() {

    const { userLoggedIn } = useAuth()

    const [isSigningIn, setIsSigningIn] = useState(false)
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
                const user = userCredential.user;
                // ...
            }).catch((error) => {
                setIsSigningIn(false)
                setErrorMessage("Invalid email or password")
            });
        }
    };

    return (<>
        {userLoggedIn ? <Navigate to={'/home'} replace={true} /> :
            <ThemeProvider theme={defaultTheme}>
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
                                label="Email Address"
                                name="email"
                                autoFocus
                                error={emailError}
                                helperText={emailError ? "Please enter a valid email" : ""}
                                onChange={(e) => {
                                    setErrorMessage('')
                                    setEmail(e.target.value)
                                    if (!e.target.value) {
                                        setEmailError(false);
                                    } else if (!e.target.validity.valid) {
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
                                label="Password"
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
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/forgotpassword" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLSc3zH_vV27IdS5ufrBMXsxCzX_3cubVT3vwoqHPFJZWsIVAYA/viewform" variant="body2">
                                        Don't have an account? Sign Up
                                    </Link>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center">
                                {isSigningIn && <CircularProgress />}
                                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            </Grid>
                            <Copyright sx={{ mt: 8, mb: 4 }} />
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        }
    </>
    );
}

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://littlecuteshop.com/">
                Little Cute Shop
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}