import { Ref, modelOptions, prop } from "@typegoose/typegoose"
import { Products } from '../products/products.schema';
import mongoose from 'mongoose';
import Schema from 'mongoose';
import {z} from "zod"
@modelOptions({options: {allowMixed:0}})
export class UserTS {
@prop({required:true,unique:true})
username!:string
@prop({required:true})
password!:string
@prop({required:true})
role!:"admin"|"user"
}
export const  zodUser = z.object({
    body:z.object({
        username:z.string({ invalid_type_error:"Username Should be a string"}).nonempty("Must provide a user"),
        password:z.string({invalid_type_error:"Password should be a string"}).nonempty("Must provide a password")
})
})

export const  zodCreateUser = z.object({
    body:z.object({
        username:z.string({ invalid_type_error:"Username Should be a string"}).nonempty("Must provide a user"),
        role:z.union([z.literal("admin"),z.literal("user")]),
        password:z.string({invalid_type_error:"Password should be a string"}).nonempty("Must provide a password"),
        password2:z.string({invalid_type_error:"Password should be a string"}).nonempty("Must provide a password")
}).refine(data=>data.password===data.password2,"Passwords must be Equal")
})

export type zodCreateUserType = z.infer<typeof zodCreateUser>
export type zodUserType =z.infer<typeof zodUser>
