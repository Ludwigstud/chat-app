import { Request, Response } from "express";
import { User } from "../models/User.js";
import * as jose from "jose";
// IMPORT the secret from your central config to ensure it matches the middleware
import { secret } from "../config/jwtConfig.js"; 

// --- Helper: Generate Token ---
// This keeps your code DRY (Don't Repeat Yourself)
const generateToken = async (user: any) => {
    return new jose.SignJWT({ id: user._id.toString(), username: user.username })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(secret);
};

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide username, email, and password." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    try {
        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) {
            return res.status(400).json({ message: "User with this email or username already exists" });
        }

        const user = await User.create({ username, email, password });

        // Use helper
        const token = await generateToken(user);

        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter email and password." });
    }

    try {
        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.comparePassword(password))) {
            // Use helper
            const token = await generateToken(user);

            res.json({
                token,
                user: { id: user._id, username: user.username, email: user.email },
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};