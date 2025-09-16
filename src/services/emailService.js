import { CLIENT_URL } from "../config/environments.js";
import path from "path";
import fs from "fs";
import { transporter } from "../config/mailer.js";

export const sendConfirmationEmail = async (user, token) => {
  const confirmationUrl = `${CLIENT_URL}/confirm-email?token=${token}`;

  const templatePath = path.resolve("src/templates/confirmEmail.html");

  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replace("{{name}}", user.name)
    .replace("{{confirmationUrl}}", confirmationUrl);

  await transporter.sendMail({
    from: `"Expense Tracker" <hammadurrehman1954@gmail.com>`,
    to: user.email,
    subject: "Confirm your email",
    html,
  });
};
