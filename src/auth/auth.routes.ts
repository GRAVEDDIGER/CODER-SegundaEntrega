import { validateSchema } from "../middlewares/zodValidation";
import { AuthController } from './auth.controller';
import { Router } from "express";
import { zodCreateUser, zodUser } from "./auth.schemas";
import { PassportController } from "./auth.passport.controller";
import passport from "passport";
const authController=new AuthController()
const passportController = new PassportController()
export const authRouter=Router();
    // authRouter.post("/login",validateSchema(zodUser),authController.login)
    // authRouter.post("/register",validateSchema(zodCreateUser),authController.register)
    authRouter.post("/login",validateSchema(zodUser),passport.authenticate("login"))
    authRouter.post("/register",validateSchema(zodCreateUser),passport.authenticate("register"))
    authRouter.get("/login",authController.getLogin)
    authRouter.get("/github",passport.authenticate("github"))
    authRouter.get("/cb",passport.authenticate("github",{failureRedirect:"/auth/login",successRedirect:"/"}))
    authRouter.get("/register",authController.getRegister)
    authRouter.get("/profile",authController.validateRol("admin"),authController.getProfile)
    authRouter.get("/logout",authController.logout)

