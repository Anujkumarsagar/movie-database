import { z } from "zod"

export function Auth(req: any, res: any, next: any) {
    try {
        req.body.username = z.string().min(3).max(20).parse(req.body.username)
        req.body.email = z.string().email().parse(req.body.email)
        req.body.password = z.string().min(6).max(20).parse(req.body.password)

        next();
    } catch (error) {
        console.log("error is this", error)
        return res.status(500).json({
            status: false,
            messgage: "Internal server error",
            error: error
        })

    }
}