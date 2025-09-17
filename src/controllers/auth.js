import { Users } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendConfirmationEmail } from "../services/emailService.js";

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

    const user = await Users.create({ email, name, password: hashedPassword });

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

    await sendConfirmationEmail(user, confirmation_token);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email, confirmation_token },
      access_token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

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
    console.log("user", user)

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "data is required" });

    // await sendConfirmationEmail(user, confirmation_token);

    return res.status(200).json({
      success: false,
      message: "Email sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};
