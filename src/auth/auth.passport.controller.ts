import { Request } from "express"
import {PassportAuthService} from "./auth.pasport.service"
import * as argon from "argon2"
import { DoneCallback } from "passport"
const passport= new PassportAuthService()
export class PassportController {
    constructor (
        private passportService=passport
    ){}
    async localLogin(req:Request,username:string,password:string,done:(error:any,data:any,...args:any)=>any){

    }
    async localSignUp(req:Request,username:string,password:string,done:(error:any,data:any,...args:any)=>any){
        try{
            const data =await this.passportService.findByUserName(username)
            // si el usuario fue encontrado entonces retorna user exist error
            if (data.ok){
                    return done(new Error("User Alrready exists"),null)
            }else {
                //aqui va el codigo que crea el usuario 
                const response = await this.passportService.createUser(username,await argon.hash(password),req.body.role)
                if(response.ok){
                    if (typeof response.data === "object" && response.data !==null&& "_id" in response.data)
                    {
                        return done(null,response.data)
                    }else return done(response.error,null)
                }
            }
        }catch(e){
            console.log(e)


        }
    }
    async serialize(user:any,done:DoneCallback){
        done(null,user.id)
    }
    async deSerialize(userId:string,done:DoneCallback){
        const data= await this.passportService.findUserById(userId)
        if (data.ok && data.data !== null){
            done (null,data)
        }else done(data.error,null)
    }
    async gitHubLogin(accesstoken:string,refreshtoken:string,profile:any,cb:DoneCallback){
    
        console.log(profile["_json"])
    }
}