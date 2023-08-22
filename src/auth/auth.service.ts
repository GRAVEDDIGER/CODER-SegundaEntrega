import { BeAnObject, IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';
import  {Document} from "mongoose"
import { ResponseObject } from '../entities/classes';
import { TypegooseDAO } from "../services/typegoose.dao";
import { UserTS, zodCreateUserType, zodUserType } from './auth.schemas';
import * as argon from "argon2"
import { Types } from 'mongoose';
const pm =new TypegooseDAO<Omit<zodCreateUserType["body"],"password2">>(UserTS,"UserTG")
export class AuthService {
    constructor(public service = pm){
      
    }
    async registerUser (user:zodCreateUserType["body"]):Promise<ResponseObject<unknown>>{
        try{
            let data = await this.service.addProduct({...user,password:await argon.hash(user.password)})
            if (data !== undefined) {
                 return new ResponseObject(null,true,data)
            }else return new ResponseObject("Error Creating User",false,null)
        }catch(error){
            console.log(error)
            return new ResponseObject(error,false,null)
        }
    }
    async loginUser(user:zodUserType["body"]):Promise<ResponseObject<(Document<unknown, BeAnObject, UserTS> & Omit<UserTS & {
        _id: Types.ObjectId;
    }, "typegooseName"> & IObjectWithTypegooseFunction) | null>>{
        try{
           const data=await this.service.model.findOne({username:user.username})
           if(data !==undefined && data !== null && typeof data.username ==="string" && data.username === user.username){
               
            if (await argon.verify(data.password,user.password)) return new ResponseObject(null,true,data)
                else return new ResponseObject("Password not Match",false,null)
           }else return new ResponseObject("User not Found",false,null)
        }catch(error){
            console.log(error)
            return new ResponseObject(error,false,null)
        }
    }

}