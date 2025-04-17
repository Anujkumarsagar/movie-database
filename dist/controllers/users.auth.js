"use strict";
// all  functions in this file are used to authenticate users
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = userLogin;
exports.userRegister = userRegister;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new client_1.PrismaClient();
function userLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            // find user by username
            const user = yield client.users.findUnique({
                where: {
                    username: username,
                    email: email
                }
            });
            // check if user exists
            if (!user) {
                return res.status(401).json({
                    message: "Invalid username or email"
                });
            }
            // match password
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid username or password",
                });
            }
            //jwt token generate
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                username: user.username,
                email: user.email,
            }, process.env.JWT_SECRET, {
                expiresIn: "48h"
            });
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 48 * 60 * 60 * 1000, // 48 hours
                sameSite: "strict",
            });
            return res.status(200).json({
                status: true,
                message: "Login successful",
                user: user
            });
        }
        catch (error) {
            console.log("error is this", error);
            return res.status(500).json({
                status: false,
                messgage: "Internal server error",
                error: error
            });
        }
    });
}
function userRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("the req is: ", req);
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // check if user exists
            const user = yield client.users.findUnique({
                where: {
                    username: username,
                    email: email
                }
            });
            console.log("user is: ", user);
            if (user) {
                // userLogin({ req, res })
                return res.status(401).json({
                    status: false,
                    message: "Already registered with this username or email",
                    user: user
                });
            }
            //create user
            const newUser = yield client.users.create({
                data: {
                    username: username,
                    email: email,
                    password: hashedPassword
                }
            });
            // jwt token generate 
            const token = jsonwebtoken_1.default.sign({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            }, process.env.JWT_SECRET, {
                expiresIn: "48h"
            });
            res.cookie("jwt", jsonwebtoken_1.default, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 48 * 60 * 60 * 1000, // 48 hours
                sameSite: "strict",
            });
            return res.status(200).json({
                status: true,
                message: "Registration successful",
                user: newUser
            });
        }
        catch (error) {
            console.log("error is this", error);
            return res.status(500).json({
                status: false,
                messgage: "Internal server error",
                error: error
            });
        }
    });
}
