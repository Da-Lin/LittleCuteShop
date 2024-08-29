import { SESClient } from "@aws-sdk/client-ses"

const SES_USER = import.meta.env.VITE_AWS_SES_LITTLE_CUTE_SHOP_USER
const SES_PASS = import.meta.env.VITE_AWS_SES_LITTLE_CUTE_SHOP_PASS
const SES_ID = import.meta.env.VITE_AWS_SES_LITTLE_CUTE_SHOP_ACCESS_KEY_ID
const SES_SECRET = import.meta.env.VITE_AWS_SES_LITTLE_CUTE_SHOP_SECRET_ACCESS_KEY

export const AWS_API_TOKEN = import.meta.env.VITE_AWS_API_TOKEN

export const sesClient = new SESClient({
    region: "us-east-1",

    smtp: {
        host: "email-smtp.us-east-1.amazonaws.com",
        port: 587,
        auth: {
            user: SES_USER,
            pass: SES_PASS
        }
    },

    credentials: {
        accessKeyId: SES_ID,
        secretAccessKey: SES_SECRET
    }
})