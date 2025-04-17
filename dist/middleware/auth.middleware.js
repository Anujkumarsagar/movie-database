"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
const zod_1 = require("zod");
function Auth(req, res, next) {
    try {
        req.body.username = zod_1.z.string().min(3).max(20).parse(req.body.username);
        req.body.email = zod_1.z.string().email().parse(req.body.email);
        req.body.password = zod_1.z.string().min(6).max(20).parse(req.body.password);
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "eror in the auth middleware",
            eror: error
        });
    }
}
