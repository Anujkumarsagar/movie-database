import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const { jwt_token } = req.headers
        if (!jwt_token) {
            return res.status(401).json({
                message: "Unautoirized",
                status: false
            })
        }
        const decoded = verify(jwt_token as string, process.env.JWT_SECRET as string)
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorised",
                status: false
            })
        }
        //@ts-ignore
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                message: "Forbidden",
                status: false
            })
        }
        //@ts-ignore
        req.user = decoded;

        next()

    } catch (error) {
        res.status(500).json({
            message: "error in isAdmin middleware",
            error: error
        })
    }
}