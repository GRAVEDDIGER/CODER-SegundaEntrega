import { prop } from "@typegoose/typegoose";

export class Products{
    @prop({required: true})
     public code!: string;
     @prop({required: true})
     public description!: string;
     @prop({required: true})
     public price!: number;
     @prop({required: true})
     public stock!: number;
     @prop({required: true})
     public thumbnail!:string;
     @prop({required: true})
     public title!:string;
     @prop({required: true})
     public id!:string

}