"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const users_auth_1 = require("../controllers/users.auth");
const authRouter = (0, express_1.Router)();
authRouter.post("/signin", auth_middleware_1.Auth, users_auth_1.userLogin);
authRouter.post("/signup", auth_middleware_1.Auth, users_auth_1.userRegister);
exports.default = authRouter;
