import User from "../models/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { comparePassword, hashPassword } from "../helpers.js/auth.js";
import nodemailer from "nodemailer";
// const crypto = require("crypto"); 
import crypto from "crypto";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    //const hashedPassword = await hashPassword(password);

    const user = await new User({
      name,
      email,
      password,
      //password: hashedPassword,
    }).save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // const match = await comparePassword(password, user.password);
    // if (!match) {
    //   return res.status(401).json({ error: "Incorrect password" });
    // }
    const match = await User.findOne({ password });
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// export const forgetPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       // To avoid revealing whether an email exists, respond with success anyway
//       return res.status(200).send('If the email is registered, the password has been sent.');
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your Account Password',
//       text: `Your password is: ${user.password}`, // Note: This assumes you're storing the password in plaintext, which is not secure.
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//         return res.status(500).send('Error sending email.');
//       } else {
//         console.log('Email sent: ' + info.response);
//         return res.status(200).send('If the email is registered, the password has been sent.');
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred.');
//   }
// };

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send("Agar email registered hai, toh password reset ka mail jayega.");
    }

    // Create password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <p>Password reset ka request mila hai.</p>
        <p><a href="${resetUrl}" target="_blank">Click yahan</a> password reset karne ke liye. Ye link ek ghante tak valid hai.</p>
      `,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Email bhejne mein error aaya.");
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .send("Agar email registered hai, toh password reset ka mail jayega.");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Kuch error hua.");
  }
};


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Check token expiry
    });

    if (!user) {
      return res.status(400).send("Invalid ya expired token.");
    }

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password minimum 6 characters ka hona chahiye." });
    }

    user.password = await hashPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).send("Password reset successful. Ab login karein.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Kuch error hua.");
  }
};
