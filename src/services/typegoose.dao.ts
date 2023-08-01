import { getModelForClass } from "@typegoose/typegoose";
import { Cart } from "../carts/cart.schema";
import { Products } from "../products/products.schema";
import mongoose, { Model, Schema } from "mongoose";
import { AnyParamConstructor, ModelType } from "@typegoose/typegoose/lib/types";
import { ResponseObject } from "../entities/classes";
const connectionString="mongodb+srv://dcsweb:adrian123@dcsweb.snm3hyr.mongodb.net/"

export class TypegooseDAO<T extends Products| Cart> {
    public static instance:any;
    public model!:ModelType<T>
    protected connect:()=>any
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
        const data = await this.model.find({})
        return data
    }catch(e){console.log(e)}
},
public getProductById=async (id:string)=>{
    try {
        const data = await this.model.findById(id)
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
        this.connect=async ()=>{
            try {
                return await mongoose.connect(connectionString)
            }catch(error)
                {console.log(error)}
            },
            
        this.connect().then(()=>{
            this.model=getModelForClass(this.schema,{schemaOptions:{timestamps:true}})
            if (TypegooseDAO.instance !== undefined) return TypegooseDAO.instance;
            else {
                TypegooseDAO.instance= this
                return TypegooseDAO.instance
            }
            
        
    
    
        }).catch((e:any)=>console.log(e))
    
        }
}