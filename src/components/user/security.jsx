import { TextField, Stack, Typography, Button, Grid, Alert } from "@mui/material";
import React from "react";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { doPasswordChange } from '../../firebase/auth'

const Security = () => {
  const { t } = useTranslation()
  const [successfulMessage, setSuccessfulMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('')

    await doPasswordChange(password).then(() => {
      setSuccessfulMessage(t('drawer').securityInformation.successfulMessage)
    }).catch((error) => {
      setErrorMessage(t('drawer').securityInformation.failuerMessage)
    });
  };

  return (
    <Stack alignItems="center">
      <Typography>{t('drawer').securityInformation.title}</Typography>
      <TextField
        margin="normal"
        required
        name="password"
        label={t('password')}
        type="password"
        id="password"
        onChange={(event) => {
          setPassword(event.target.value)
          setSuccessfulMessage('')
          setErrorMessage('')
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={password === ''}
        onClick={handleSubmit}
      >
        {t('submit')}
      </Button>
      <Grid container justifyContent="center">
        {successfulMessage && <Alert>{successfulMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Grid>
    </Stack>
  )
}

export default Security;
