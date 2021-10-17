const nodemailer = require("nodemailer");
const CONFIG = require("../../config/app_config");

const sendMail = (to, subject, body, type) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com" || CONFIG.email_host,
    port: 587 || CONFIG.email_port,
    secure: false,
    auth: {
      user: "" || CONFIG.email_username,
      pass: "" || CONFIG.email_secret,
    },
  });

  let mailOptions = {};
  if (type == 1) {
    mailOptions = {
      from: '"Game" ',
      to: to,
      subject: subject,
      text: body,
    };
  } else {
    mailOptions = {
      from: '"Game" ',
      to: to,
      subject: subject,
      html: body,
    };
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent:" + info.response);
    }
  });
};

module.exports.sendMail = sendMail;
