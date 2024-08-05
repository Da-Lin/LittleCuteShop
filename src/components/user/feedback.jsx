import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Alert, Button, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import { validateEmail } from '../authentication/signin';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [content, setContent] = useState('')
  const [name, setName] = useState('')

  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const emailContent = { subject: subject, email: email, message: content, name: name };

  const { t } = useTranslation()

  const resetMessage = () => {
    setErrorMessage('')
    setMessage('')
  }

  const sendEmail = (e) => {
    e.preventDefault();
    resetMessage()

    setIsSendingEmail(true)
    emailjs
      .send('service_rfnxvbs', 'template_6ppiony', emailContent, {
        publicKey: 'Lx8hE39ZJTFeQmYqi',
      })
      .then(
        () => {
          setIsSendingEmail(false)
          setMessage(t('drawer').submitFeedback.successfulMessage)
        },
        (error) => {
          setIsSendingEmail(false)
          console.log(error)
          setErrorMessage(t('drawer').submitFeedback.failuerMessage)
        },
      );
  };

  return (
    <Stack alignItems="center">
      <Typography m={2}>
        {t('drawer').submitFeedback.title}
      </Typography>
      <Divider style={{ width: '100%' }} />
      <TextField
        margin="normal"
        required
        size="small"
        label={t('drawer').submitFeedback.name}
        onChange={(event) => {
          setName(event.target.value)
          resetMessage()
        }}
      />
      <TextField
        margin="normal"
        required
        size="small"
        type='email'
        label={t('drawer').submitFeedback.email}
        error={emailError}
        helperText={emailError ? "邮箱格式不对" : ""}
        onChange={(e) => {
          resetMessage()
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
      />
      <TextField
        margin="normal"
        required
        size="small"
        type='email'
        label={t('drawer').submitFeedback.subject}
        onChange={(event) => {
          setSubject(event.target.value)
          resetMessage()
        }}
      />
      <TextField
        margin="normal"
        required
        label={t('drawer').submitFeedback.content}
        multiline
        rows={4}
        sx={{ width: 500 }}
        onChange={(event) => {
          setContent(event.target.value)
          resetMessage()
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={email === '' || subject === '' || name === '' || content === '' || emailError}
        onClick={sendEmail}
      >
        提交
      </Button>
      <Stack container justifyContent="center">
        {isSendingEmail && <CircularProgress />}
        {message && <Alert>{message}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>
    </Stack>
  );
};
