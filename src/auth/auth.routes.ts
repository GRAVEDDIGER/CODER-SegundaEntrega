import { validateSchema } from "../middlewares/zodValidation";
import { AuthController } from './auth.controller';
import { Router } from "express";
import { zodCreateUser, zodUser } from "./auth.schemas";
const authController=new AuthController()
export const authRouter=Router();
authRouter.post("/login",validateSchema(zodUser),authController.login)
authRouter.post("/register",validateSchema(zodCreateUser),authController.register)
authRouter.get("/login",authController.getLogin)
authRouter.get("/register",authController.getRegister)
authRouter.get("/profile",authController.getProfile)
authRouter.get("/logout",authController.logout)