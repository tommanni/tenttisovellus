const fs = require('fs');
const { Pool } = require('pg')
const express = require('express')  //Jos ei toimi, niin "npm install express"
const https = require('https')
const app = express()
const port = 4000
const cors = require('cors');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tommanni1234@gmail.com',
        pass: 'wbfrmkmawdtlpeei'
    }
});

var mailOptions = {
    from: 'tommanni1234@gmail.com',
    to: 'juvuorin@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'Tomi Manninen'
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})