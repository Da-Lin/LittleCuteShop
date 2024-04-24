import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../contexts/authContext'
import { useState } from 'react';
import { doPasswordReset } from '../../firebase/auth'
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, Paper } from '@mui/material';
import { Navigate } from 'react-router-dom';
import LogoSide from './logoSide';

const defaultTheme = createTheme();

export default function ForgotPassword() {

    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [isloading, setIsloading] = useState(false)
    const [confrimationMessage, setConfrimationMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true)

        await doPasswordReset(email).then(() => {
            setIsloading(false)
            setErrorMessage("")
            setConfrimationMessage("Password reset email sent!")
        }).catch((error) => {
            setIsloading(false)
            setConfrimationMessage("")
            setErrorMessage("Invalid email")
        });
    }

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
                            <Typography variant="h3" gutterBottom align="center">
                                Forgot your password?
                            </Typography>
                            <Typography variant="body2" align="center">
                                {"Enter your email address below and we'll " +
                                    'send you a link to reset your password.'}
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

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={email === '' || emailError}
                                onClick={handleSubmit}
                            >
                                Send reset link
                            </Button>

                            <Grid container justifyContent="center">
                                {isloading && <CircularProgress />}
                                {confrimationMessage && <Alert >{confrimationMessage}</Alert>}
                                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        }
    </>
    );
}