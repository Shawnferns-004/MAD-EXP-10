import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { sendMail } from "../config/emailConfig.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Store OTPs temporarily
const otpStorage = {};

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword })
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    otpStorage[email] = { otp, expiresAt: Date.now() + 300000 }; // Expires in 5 min

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Your OTP for Password Reset</h2>
        <p style="font-size: 18px;"><strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `;

    await sendMail(email, "Password Reset OTP", emailTemplate);
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const storedOtp = otpStorage[email];
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    delete otpStorage[email];

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating password" });
  }
};


export { verifyOtp , sendOtp , changePassword}