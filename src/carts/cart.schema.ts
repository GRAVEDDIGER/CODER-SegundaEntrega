import { prop } from "@typegoose/typegoose"
import { Products } from '../products/products.schema';
export class Cart {
    @prop()
    public Products!:Products[];

}
