import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Alert, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { validateEmail } from '../authentication/signin';

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
          setMessage('发送邮件成功')
        },
        (error) => {
          setIsSendingEmail(false)
          console.log(error)
          setErrorMessage('发送邮件失败')
        },
      );
  };

  return (
    <Stack alignItems="center">
      <TextField
        margin="normal"
        required
        size="small"
        label="名字"
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
        label="邮箱"
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
        label="主题"
        onChange={(event) => {
          setSubject(event.target.value)
          resetMessage()
        }}
      />
      <TextField
        margin="normal"
        required
        label="内容"
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
