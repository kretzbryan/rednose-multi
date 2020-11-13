const sgMail = require('@sendgrid/mail');
const config = require('config')

sgMail.setApiKey(config.sendgridAPIKey);


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "kretzbryan@gmail.com",
        subject: 'Welcome to Rednose!',
        text: `Hi ${name}! Let me know what you think of this app!`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'kretzbryan@gmail.com',
        subject: `We're sorry to see you go!`,
        text: `Hi ${name}. We're sad to see you leave!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}