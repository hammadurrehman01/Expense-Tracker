import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("user -------->", process.env.EMAIL_USER)
console.log("pass -------->", process.env.EMAIL_PASS)

export const transporter = nodemailer.createTransport({
  service: "gmail",
 port: 587, // Use port 587 instead of 465
  secure: false, // Must be false for STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});
