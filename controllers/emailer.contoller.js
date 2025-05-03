import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const fromEmail = process.env.EMAIL_USER;  // e.g., info@acquiescent.in
const toEmail = process.env.EMAIL_TO;      // the recipient email
console.log("From Email:", fromEmail);
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: fromEmail,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // <== THIS ALLOWS SELF-SIGNED CERTS
    },
  });
  

export const sendEmail = async (req, res) => {
  const { title, body } = req.body;

  const mailOptions = {
    from: `"Acquiescent : " <${fromEmail}>`,  // Customize sender name if needed
    to: toEmail,
    subject: title,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
};
