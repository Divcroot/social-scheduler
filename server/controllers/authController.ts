import { Request, Response } from "express";
import { User } from "../models/Users.js";
import { compare, genSalt, hash } from "bcrypt";
import { generateToken } from "../utils/generateToken.js";


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        //Validation
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: "Name, email and password are required" });
            return;
        }

        if (name.length < 3) {
            res.status(400).json({ success: false, message: 'Name must be at least 3 characters' })
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
            return;
        }

        //check existing user
        const userExists = await User.findOne({ email: email.toLowerCase() });

        if (userExists) {
            res.status(409).json({ success: false, message: "User already exists with this email" });
            return;
        }

        //Hash Password
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        //Create user
        const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });

        //Generate Token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error' });
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        //Validation
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }

        const isPassword = await compare(password, user.password);

        if (!isPassword) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }

        const token = generateToken(user._id.toString());

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || 'Server error' })
    }
}