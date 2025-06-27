
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { z } from "zod";
import { client } from "../utils/client.prisma";


// Schema validation using zod
const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.string().optional(),
});

// User login
export async function userLogin(req: Request, res: Response): Promise<any> {
    try {
        const { username, email, password } = req.body;

        // Validate input
        const validation = userSchema.pick({ username: true, email: true, password: true }).safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                status: false,
                message: "Invalid input",
                errors: validation.error.errors,
            });
        }

        // Find user by username or email
        const user = await client.users.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid username or email",
            });
        }

        // Match password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid password",
            });
        }

        // Generate JWT token
        const token = Jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "48h" }
        );

        // Set cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 48 * 60 * 60 * 1000, // 48 hours
            sameSite: "strict",
        });

        return res.status(200).json({
            status: true,
            message: "Login successful",
            user: { id: user.id, username: user.username, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error,
        });
    }
}

// User registration
export async function userRegister(req: Request, res: Response): Promise<any> {
    try {
        // Validate input
        const validation = userSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                status: false,
                message: "Invalid input",
                errors: validation.error.errors,
            });
        }

        const { username, email, password, role } = validation.data;

        // Check if user already exists
        const existingUser = await client.users.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: "User already registered with this username or email",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await client.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: "user" , 
            },
        });

        // Generate JWT token
        const token = Jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email , role: newUser.role},
            process.env.JWT_SECRET as string,
            { expiresIn: "48h" }
        );

        // Set cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 48 * 60 * 60 * 1000, // 48 hours
            sameSite: "strict",
        });

        return res.status(201).json({
            status: true,
            message: "Registration successful",
            user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error,
        });
    }
}
