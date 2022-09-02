import 'reflect-metadata';
// import {prop } from "@typegoose/typegoose";
import {Field, ID, ObjectType} from "type-graphql";
import {Schema } from 'mongoose';

@ObjectType()
class BaseEntity {

    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}

export {
    BaseEntity
}