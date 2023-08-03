import { getModelForClass } from "@typegoose/typegoose";
import { Cart } from "../carts/cart.schema";
import { Products } from "../products/products.schema";
import mongoose, { Model, Schema } from "mongoose";
import { AnyParamConstructor, ModelType } from "@typegoose/typegoose/lib/types";
import { ResponseObject } from "../entities/classes";
import { ChatMessage } from "../chat/chat.schema";
const connectionString="mongodb+srv://dcsweb:adrian123@dcsweb.snm3hyr.mongodb.net/"

export class TypegooseDAO<T extends Products| Cart|ChatMessage> {
    static instance:any;
    public model!:ModelType<T>
    constructor(
protected schema: AnyParamConstructor<T>,
protected modelName:string,

public addProduct = async (product: Omit<T,"id">) => {
    try{
    const data=await this.model.create(product)
    return data
}catch(e){console.log(e)}
},
public getProducts=async()=>{
    try{
        const data = await this.model.find({}).lean()
        return data
    }catch(e){console.log(e)}
},
public getProductById=async (id:string)=>{
    try {
        const data = await this.model.findById(id).lean()
        return data
    }catch(e){console.log(e)}
},
public updateProduct=async(id:string,product:Partial<T>)=>{
try{
    const data =await this.model.updateOne({id},product)
    return data
}catch(e){console.log(e)}
},
public deleteProduct=async(id:string)=>{
    try{
        const data =await this.model.deleteOne({id})
        return data
    }catch(e){console.log(e)}
}
)        
    {   
// Singleton Patern tha instanciates de COnnection to the Database..                 
            if (TypegooseDAO.instance !== undefined) return TypegooseDAO.instance;
            else {
                 mongoose.connect(connectionString).then(()=>{
                    this.model=getModelForClass(this.schema,{schemaOptions:{timestamps:true}})
                    TypegooseDAO.instance=this
                    console.log("Connected to Mongoose")
                }).catch(error=>{console.log(error)});
            }
        }
}