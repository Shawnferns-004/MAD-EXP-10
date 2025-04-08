import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendVerificationEmail from '../config/emailConfig.js';


dotenv.config()

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists',
        email,
        password
       });
    }

    const user = await User.create({ 
      name, 
      email, 
      password,
      username // Set verified to false initially
    });

    // Generate a verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const origin = req.get("origin");
    
    // Send verification email
    sendVerificationEmail(user.email, token, origin);

    res.status(201).json({
      message: 'User registered. Please verify your email.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOneAndUpdate({ email }, { verified: true });
    if (!user) return res.status(400).json({ error: "Invalid token" });

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token." });
  }
};

export const userEmailGet = async (req, res) => {
  try {
    const { email } = req.params;

    // Correct way to query by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsername = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required", status: false });
    }

    // Check if the new username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists", status: false });
    }

    // Find user by email and update the username
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { username } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    res.json({ message: "Username updated successfully!", status: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUser = async(req,res)=>{
  try {
    const { email } = req.params;

    // Correct way to query by email
    const user = await User.findOne({ email });

    const username = user.username

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(username);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
