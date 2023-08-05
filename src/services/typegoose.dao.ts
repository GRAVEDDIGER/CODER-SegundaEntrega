import { getModelForClass } from "@typegoose/typegoose";
import { CartSchema } from "../carts/cart.schema";
import { Products } from "../products/products.schema";
import mongoose, { Model, Schema } from "mongoose";
import { AnyParamConstructor, ModelType } from "@typegoose/typegoose/lib/types";
import { ResponseObject } from "../entities/classes";
import { ChatMessage } from "../chat/chat.schema";
const connectionString="mongodb+srv://dcsweb:adrian123@dcsweb.snm3hyr.mongodb.net/"

export class TypegooseDAO<T extends Products| CartSchema|ChatMessage> {
    static instance:any
    public model!:ModelType<T>
    constructor(
protected schema: AnyParamConstructor<T>,
protected modelName:string,

)        
    {   
// Singleton Patern tha instanciates de COnnection to the Database..                 
            if (TypegooseDAO.instance !== undefined &&  TypegooseDAO.instance !== null) {
                console.log("Realoading Instance")
                return TypegooseDAO.instance;}
 
            else {
                console.log(TypegooseDAO.instance)
                 mongoose.connect(connectionString).then(()=>{
                    this.model=getModelForClass(this.schema,{schemaOptions:{timestamps:true}})
                    TypegooseDAO.instance=this
                    console.log("Connected to Mongoose")
                }).catch(error=>{console.log(error)});
            }
        }
        async addProduct  (product: Omit<T,"id">) {
            try{
            const data=await this.model.create(product)
            return data
        }catch(e){console.log(e)}
        }
        async getProducts(){
            try{
                const data = await this.model.find({}).lean()
                return data
            }catch(e){console.log(e)}
        }
        async getProductById (id:string){
            try {
                const data = await this.model.findById(id).lean()
                return data
            }catch(e){console.log(e)}
        }
        async updateProduct(id:string,product:Partial<T>){
        try{
            const data =await this.model.updateOne({id},product)
            return data
        }catch(e){console.log(e)}
        }
        async deleteProduct(id:string){
            try{
                const data =await this.model.deleteOne({id})
                return data
            }catch(e){console.log(e)}
        }
        
}