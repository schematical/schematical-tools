import 'reflect-metadata';
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, index, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";
import {FilterQuery, Schema} from "mongoose";
import {GraphQLJSONObject} from "graphql-type-json";
import mongoose from "mongoose";
// 1. Create an interface representing a document in MongoDB.
/*@index({ location: '2dsphere' })*/
@ObjectType()
export class Resource extends BaseEntity {

    @prop({ type: () => String })
    @Field(() => String)
    remoteId?: string;

    @prop({ type: () => String })
    @Field(() => String)
    name: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @prop({ type: () => Object })
    public attributes?: any;


    @prop({ type: () => [String] })
    @Field(() => [String], { nullable: true })
    deps?: string[];





}

// 3. Create a Model.
export const ResourceModel = getModelForClass(Resource);
Container.set('ResourceModel', ResourceModel);


@InputType()
export class ResourceCreateInput implements Partial<Resource>{
    @Field(() => String)
    name: string;
}
@InputType()
export class ResourceUpdateInput extends ResourceCreateInput implements Partial<Resource>{
    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}
@InputType()
export class ResourceFilterInput implements FilterQuery<Resource>{
    @Field(() => String)
    name?: string;
}