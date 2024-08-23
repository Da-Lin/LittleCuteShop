import * as AWS from "aws-sdk"

AWS.config.update({
    region: "us-east-1",
    accessKeyId: import.meta.env.AWS_SES_LITTLE_CUTE_SHOP_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.AWS_SES_LITTLE_CUTE_SHOP_SECRET_ACCESS_KEY
})

export const ses = new AWS.SES({
    region: "us-east-1",
    smtp: {
        host: "email-smtp.us-east-1.amazonaws.com",
        port: 587,
        auth: {
            user: import.meta.env.AWS_SES_LITTLE_CUTE_SHOP_USER,
            pass: import.meta.env.AWS_SES_LITTLE_CUTE_SHOP_PASS
        }
    }
})