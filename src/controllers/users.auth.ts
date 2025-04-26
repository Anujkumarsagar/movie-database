// all  functions in this file are used to authenticate users

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextFunction, Request, Response } from "express"
import Jwt from "jsonwebtoken"
import {z} from "zod"
const client = new PrismaClient()


export async function userLogin(req :Request, res : Response) : Promise<any> {

    try {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        // find user by username
        const user = await client.users.findUnique({
            where: {
                username: username,
                email: email
            }
        })

        // check if user exists
        if (!user) {
            return res.status(401).json(
                {
                    message: "Invalid username or email"
                }
            )
        }

        // match password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid username or password",
            })
        }

        //jwt token generate
        const token = Jwt.sign({
            id: user.id,
            username: user.username,

            email: user.email,
        }, process.env.JWT_SECRET as string, {
            expiresIn: "48h"
        })

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 48 * 60 * 60 * 1000, // 48 hours
            sameSite: "strict",
        })

        return res.status(200).json({
            status: true,
            message: "Login successful",
            user: user
        })





    } catch (error) {
        console.log("error is this", error)
        return res.status(500).json({
            status: false,
            messgage: "Internal server error",
            error: error
        })
    }
}


export async function userRegister(req : Request , res : Response) : Promise<any> {

    try {

        console.log("the req is: ",req)
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;

        const hashedPassword = await bcrypt.hash(password, 10);

        // check if user exists

        const user = await client.users.findUnique({
            where: {
                username: username,
                email: email
            }
        })

        console.log("user is: ", user)

        if (user) {
            // userLogin({ req, res })
            return res.status(401).json({
                status: false,
                message: "Already registered with this username or email",
                user: user
            })
        }

        //create user
        const newUser = await client.users.create({
            data:{
                username: username,
                email: email,
                password: hashedPassword,
                role: role
            }

        })

        // jwt token generate 
        const token = Jwt.sign({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        }, process.env.JWT_SECRET as string, {
            expiresIn: "48h"
        })

        res.cookie("jwt", Jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 48 * 60 * 60 * 1000, // 48 hours
            sameSite: "strict",
        })

        return res.status(200).json({
            status: true,
            message: "Registration successful",
            user: newUser
        })

    } catch (error) {
        console.log("error is this", error)
        return res.status(500).json({
            status: false,
            messgage: "Internal server error",
            error: error
        })

    }
}
