import { prop } from "@typegoose/typegoose"
import { Products } from '../products/products.schema';
type Product={pid:string,quantity:number}
export class CartSchema {
    @prop()
    public products?:Product[]

}
