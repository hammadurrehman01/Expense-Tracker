import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("user -------->", process.env.EMAIL_USER)
console.log("pass -------->", process.env.EMAIL_PASS)

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  debug: true,
  logger: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});
