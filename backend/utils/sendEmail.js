const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "tempor478@gmail.com",
      pass: "TempoRary@gmail",
    },
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  console.log(mailOptions.text);
  // const info = await transporter.sendMail(mailOptions);
  // console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
