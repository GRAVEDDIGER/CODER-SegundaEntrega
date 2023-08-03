import { prop } from "@typegoose/typegoose"
import { Products } from '../products/products.schema';
export class CartSchema {
    @prop({required:true})
    public products!:{pid:string,quantity:number}[]

}
