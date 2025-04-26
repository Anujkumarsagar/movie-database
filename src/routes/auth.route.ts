import { Router } from "express";
import { Auth } from "../middleware/auth.middleware";
import { userLogin, userRegister } from "../controllers/users.auth";


const authRouter = Router();

authRouter.post("/signin", Auth , userLogin)
authRouter.post("/signup", Auth , userRegister)



export default authRouter;