import { Request } from "express"
import {PassportAuthService} from "./auth.pasport.service"
import * as argon from "argon2"
import { DoneCallback } from "passport"
import passport from 'passport';
const passportAuthService= new PassportAuthService()
export class PassportController {
    constructor (
        protected passportService= passportAuthService
    ){}
    async localLogin(req:Request,username:string,password:string,done:(error:any,data:any,...args:any)=>any){
try{
        const data = await passportAuthService.findByUserName(username)
        if (data.ok){
            const response = data.data
            if (response !== null&& typeof response ==="object" && "password" in response){
                if (await argon.verify(response.password,password)){
                    return done(null,response)
                }else throw new Error ("Wrong Password")
            }else throw new Error("User not found")
        }else throw new Error("User not found!")
}catch(e){
    console.log(e)
    return done(e,null)
}
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
return done(e,null)

        }
    }
    async serialize(user:any,done:DoneCallback){
        console.log("serialize", user)
        done(null,user._id)
    }
    async deSerialize(userId:string,done:DoneCallback){
        const data= await passportAuthService.findUserById(userId)
        console.log(data,"serialize data")
        if (data.ok && data.data !== null){
            console.log("deserialize",data.data)
            done (null,data.data)
        }else done(data.error,null)
    }
    async gitHubLogin(accesstoken:string,refreshtoken:string,profile:any,cb:DoneCallback){
        try{
 
            if (profile !== null &&typeof profile =="object" && "_json" in profile && "email" in profile._json) {
                const username = profile["_json"].email as string
                const data = await passportAuthService.findByUserName(username.toLowerCase())
                console.log(data,username)
                if (data.ok){
                    const response = data.data
                    if (response !== null && typeof response ==="object" && "_id" in response){
                        return cb(null,response)

                    } else{
                        throw new Error("User not found!")
                    }
                }else throw new Error("User not found!")
            }else throw new Error("User not Found!")
            

        }catch(e){
            console.log(e)
            return cb(e,null)

        }
    }
}