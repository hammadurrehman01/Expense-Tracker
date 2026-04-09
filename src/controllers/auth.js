import { Users } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendConfirmationEmail } from "../services/emailService.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email && !name && !password)
      return res
        .status(400)
        .json({ success: false, message: "data is required" });

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await axios.get("https://ipwho.is/");

   const country = response.data.country;

   const countryData = await axios.get(`https://restcountries.com/v3.1/name/${country}`);

   const currencies = countryData.data[0].currencies;
   const currencyCode = Object.keys(currencies)[0];
   const currencySymbol = currencies[currencyCode].symbol;  

   console.log("currencyCode ==>", currencyCode);
   console.log("currencySymbol ==>", currencySymbol);
   


    const user = await Users.create({ email, name, password: hashedPassword, currencyCode, currencySymbol });

    const access_token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const confirmation_token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const confirmationUrl = await sendConfirmationEmail(user, confirmation_token);
    console.log("confirmationUrl ==>", confirmationUrl)

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currencyCode: user.currencyCode,
        currencySymbol: user.currencySymbol,
        confirmation_token,
      },
      access_token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const googleAuth = async (req, res) => {
 try {
    const { token } = req.body;
    console.log("token ==>", token)

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("ticket ==>", ticket)

    const payload = ticket.getPayload();

    console.log("payload ==>", payload)

    const { email, name, sub } = payload;

    // Check if user exists
      const user = await Users.findOne({ email });

    if (!user) {
      // Signup
     const user = await Users.create({ email, name });
    }

    // Create your own JWT
    const appToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Authentication successful",
      token: appToken,
      user,
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
}

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password)
      return res.json({ success: false, message: "data is required" });

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this email is not exists",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user?.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: false,
      message: "User loggedin successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const resendEmail = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    await sendConfirmationEmail(user, user.confirmation_token);

    return res.status(200).json({
      success: true,
      message: "Email sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};
