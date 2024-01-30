import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { zodCreateUserType, zodUserType } from './auth.schemas';
const authService= new AuthService()
export class AuthController{
    constructor(public service=authService){}
    // async login(req:Request<any,any,zodUserType["body"]>,res:Response){
    //     try{
    //         const response = await authService.loginUser(req.body)
    //         if (response.ok){
    //             const data=response.data
    //             if (data !== null && "id" in data && data.id !== null && "role" in  data){
    //                     req.session.user=data.id as string
    //                     req.session.role=data.role as string
    //                     req.session.save()
    //                     res.redirect("/")
    //             }else {
    //                 req.session.destroy((err)=>{console.log("Error destroying session ",err)})
    //                 res.redirect("/auth/login")
    //         }
    //         }
    //     }catch(error){console.log(error)
    //     res.send(error)
    //     }
    // }
    // async register (req:Request<any,any,zodCreateUserType["body"]>,res:Response){
    //    console.log("register")
    //     try{
    //         const data = await authService.registerUser(req.body)
    //         console.log(data)
    //         if (data.ok)
    //         {
    //             if (data.data !== undefined && data.data !== null)
    //             {
    //                 const response:unknown= data.data
    //                 if (typeof response === "object" && response !== null && "id" in response && response.id !== null && "role" in response && response.role !== null){
    //                     req.session.user= response.id as string
    //                     req.session.role=response.role as string
    //                 }
    //                 res.redirect("/")
    //             }else res.redirect("/auth/login")
    //         }else res.redirect("/auth/register")          
    //     }catch(error){
    //         console.log(error)
    //         res.redirect("/auth/register")
    //     }
    // }
    async getLogin (_req:Request,res:Response){
        res.render("login")
            }
    getGhLogin(_req:Request,res:Response){
        res.render("login")
    }        
    getRegister (_req:Request,res:Response){res.render("register")}
    getProfile (req:Request,res:Response) {
        res.render("profile",{user:req.user})
    }
    validateRol (admitedRoles:zodCreateUserType["body"]["role"]){return (req:Request,res:Response,next:NextFunction)=>{
    console.log("dentro de validateRol",req.user)
        if (req.user !== undefined && "role" in req.user){
        if (admitedRoles === req.user.role)  next()
        else res.send("Unauthorized")
    }else res.render("login")
    }}
    logout(req:Request,res:Response){
        req.session.destroy((error)=>res.send({message:"Unable to destroy session",error}))

    }
}
