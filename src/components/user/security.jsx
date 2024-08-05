import { TextField, Stack, Typography, Button, Grid, Alert, CircularProgress } from "@mui/material";
import React from "react";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { doPasswordChange } from '../../firebase/auth'

const Security = () => {
  const { t } = useTranslation()
  const [successfulMessage, setSuccessfulMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('')
    setIsSendingRequest(true)
    await doPasswordChange(password).then(() => {
      setIsSendingRequest(false)
      setSuccessfulMessage(t('drawer').securityInformation.successfulMessage)
    }).catch((error) => {
      setIsSendingRequest(false)
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
        disabled={password === '' || isSendingRequest}
        onClick={handleSubmit}
      >
        {t('submit')}
      </Button>
      <Grid container justifyContent="center">
        {isSendingRequest && <CircularProgress />}
        {successfulMessage && <Alert>{successfulMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Grid>
    </Stack>
  )
}

export default Security;
