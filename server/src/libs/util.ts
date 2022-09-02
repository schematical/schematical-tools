import {prop} from "@typegoose/typegoose";

export interface Type<T> extends Function {
    new (...args: any[]): T;
}
export class TypegooseLocation{

    @prop()
    readonly type: String;

    @prop({ required: true })
    coordinates: [[Number]];
}