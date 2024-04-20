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
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../contexts/authContext'
import { useState } from 'react';
import { doSignInWithEmailAndPassword } from '../../firebase/auth'
import CircularProgress from '@mui/material/CircularProgress';
import { Alert } from '@mui/material';
import { Navigate } from 'react-router-dom';
// import { collection, getDoc, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase/firebase';

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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {

    const { userLoggedIn } = useAuth()

    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        // const querySnapshot = await getDocs(collection(db, "users"));
        // querySnapshot.forEach((doc) => {
        //     console.log(`${doc.id} => ${getDoc(doc.ref)}`);
        // });
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
                <Container component="main" maxWidth="xs">
                    {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
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
                        <Grid container justifyContent="center">
                            {isSigningIn && <CircularProgress />}
                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                        </Grid>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        }
    </>
    );
}