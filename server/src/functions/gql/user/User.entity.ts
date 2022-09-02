import 'reflect-metadata';
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";

// 1. Create an interface representing a document in MongoDB.
@ObjectType()
export class User extends BaseEntity {
    @prop({ type: () => String })
    @Field(() => String)
    email: string;

    @prop({ type: () => String })
    @Field(() => String)
    firstName: string;

    @prop({ type: () => String })
    @Field(() => String)
    lastName: string;



}

// 3. Create a Model.
export const UserModel = getModelForClass(User);
Container.set('UserModel', UserModel);
