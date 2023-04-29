import nodemailer from "nodemailer";

const sendEmail = async (subject, email, html, text) => {
  console.log("---------------------------");
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // send mail with defined transport object
    let mailOptions = {
      from: "easycoding2000@gmail.com", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("===", err);
        console.log("Error Occurs");
      } else {
        console.log("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default sendEmail;
