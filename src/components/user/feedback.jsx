import React, { useState } from 'react';
import { Alert, Button, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/authContext';
import { ses } from '../../aws/aws';

export default function Contact() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')

  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { t } = useTranslation()

  const { userInfo } = useAuth()

  const resetMessage = () => {
    setErrorMessage('')
    setMessage('')
  }

  const getEmailContent = () => {
    return {
      Source: "littlecuteshop2024@gmail.com",
      Destination: {
        ToAddresses: ["xiaokeairong@gmail.com"]
      },
      Message: {
        Subject: {
          Data: `Feedback submitted by ${userInfo.name}: ${subject}`
        },
        Body: {
          Html: {
            Data: content
          }
        }
      }
    }
  }

  const sendEmail = (e) => {
    e.preventDefault();
    resetMessage()

    setIsSendingEmail(true)
    ses.sendEmail(getEmailContent())
      .then(() => {
        setIsSendingEmail(false)
        setMessage(t('drawer').submitFeedback.successfulMessage)
      }).catch((error) => {
        setIsSendingEmail(false)
        console.log(error)
        setErrorMessage(t('drawer').submitFeedback.failuerMessage)
      });
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
        disabled={subject === '' || content === ''}
        onClick={sendEmail}
      >
        {t('submit')}
      </Button>
      <Stack container justifyContent="center">
        {isSendingEmail && <CircularProgress />}
        {message && <Alert>{message}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>
    </Stack>
  );
};
