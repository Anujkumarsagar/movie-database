import { Router } from "express";
import { Auth } from "../middleware/auth.middleware";
import { userLogin } from "../controllers/users.auth";


const authRouter = Router();

authRouter.post("/login", Auth , userLogin)



export default authRouter;