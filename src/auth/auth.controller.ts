import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { zodCreateUserType, zodUserType } from './auth.schemas';

export class AuthController{
    constructor(public service=new AuthService()){}
    async login(req:Request<any,any,zodUserType["body"]>,res:Response){
        try{
            const response = await this.service.loginUser(req.body)
            if (response.ok){
                const data=response.data
                if (data !== null && "id" in data && data.id !== null && "role" in  data){
                        req.session.user=data.id as string
                        req.session.role=data.role as string
                        req.session.save()
                        res.render("index")
                }else {
                    req.session.destroy((err)=>{console.log("Error destroying session ",err)})
                    res.render("login")
            }
            }
        }catch(error){console.log(error)
        res.send(error)
        }
    }
    async register (req:Request<any,any,zodCreateUserType["body"]>,res:Response){
        try{
            const data = await this.service.registerUser(req.body)
            if (data.ok)
            {
                if (data.data !== undefined && data.data !== null)
                {
                    const response:unknown= data.data
                    if (typeof response === "object" && response !== null && "id" in response && response.id !== null && "role" in response && response.role !== null){
                        req.session.user= response.id as string
                        req.session.role=response.role as string
                    }
                    res.render("index")
                }else res.render("login")
            }else res.render("register")          
        }catch(error){
            console.log(error)
            res.render("register")
        }
    }
    async getLogin (_req:Request,res:Response){
        res.render("login")
            }
    getRegister (_req:Request,res:Response){res.render("register")}
    getProfile (_req:Request,res:Response) {
        res.render("profile")
    }
    validateRol (admitedRoles:zodCreateUserType["body"]["role"]){return (req:Request,res:Response,next:NextFunction)=>{
    if (req.session.user !== undefined){
        if (admitedRoles === req.session.role)  next()
        else res.send("Unauthorized")
    }else res.render("login")
    }}
    logout(req:Request,res:Response){
        req.session.destroy((error)=>res.send({message:"Unable to destroy session",error}))

    }
}
