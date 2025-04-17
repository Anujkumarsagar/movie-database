import { NextFunction, Request, Response } from "express";
import { z } from "zod"

export function Auth(req: Request, res: Response, next: NextFunction) {
    try {
        req.body.username = z.string().min(3).max(20).parse(req.body.username)
        req.body.email = z.string().email().parse(req.body.email)
        req.body.password = z.string().min(6).max(20).parse(req.body.password)

        next();
    } catch (error) {
        res.status(500).json({
            message:"eror in the auth middleware",
            eror: error
        })

    }
}