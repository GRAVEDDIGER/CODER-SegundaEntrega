import { Document } from "mongoose";
import { ResponseObject } from "../entities/classes";
import { IProductService, Product } from "../entities/products";
import { ProductManager } from "../services/fs.dao";
import { TypegooseDAO } from "../services/typegoose.dao";
import { Products } from "./products.schema";
const productManager = new ProductManager<Product>("./src/products/products.json")
const pm=new TypegooseDAO<Products>(Products,"products")
export class ProductService implements IProductService {
    constructor(
        protected dao = pm,//productManager,
        public getData = async (limit?: number) => {
            try {
                const data = await this.dao.getProducts()
                if (limit !== undefined && data !== undefined && Array.isArray(data)) {
                    const processedData = data.slice(0, limit)
                    return new ResponseObject<Products>(null, true, processedData )
                } else if (data !== undefined) {
                    return new ResponseObject<Products>(null, true, data)
                } else return new ResponseObject<Products>("Data response is null", false, null)
            } catch (e) {
                console.log(e)
                return new ResponseObject<Products>(e, false, null)
            }
        },
        public getById = async (id: string) => {
            try {
                const data = await this.dao.getProductById(id)
                if (data !== undefined) return new ResponseObject<Products>(null, true, data)
                else return new ResponseObject<Products>("Product not found", false, null)
            }
            catch (error) {
                console.log(error)
                return new ResponseObject<Products>(error, false, null)
            }
        },
        public addProduct = async (product: Omit<Products, "id">) => {
            try {
                const response = await this.dao.addProduct(product)
                return new ResponseObject<Products>(null, true, response as Products)

            } catch (error) {
                console.log(error)
                return new ResponseObject<Products>(error, false, null)
            }
        },
        public updateProduct = async (product: Products) => {
            try {
                const response = await this.dao.updateProduct(product.id, product)
                return new ResponseObject<any>(null, true, response)

            } catch (error) {
                console.log(error)
                return new ResponseObject<Products>(error, false, null)
            }
        },
        public deleteProduct = async (id: string): Promise<ResponseObject<null> | undefined> => {
            try {
                await this.dao.deleteProduct(id)
                return new ResponseObject<null>(null, true, null)

            } catch (error) {
                console.log(error)
                return new ResponseObject<null>(error, false, null)
            }
        }
    ) {
    }
}