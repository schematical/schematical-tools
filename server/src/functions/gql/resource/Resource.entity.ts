import 'reflect-metadata';
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, index, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";
import {FilterQuery, Schema} from "mongoose";
import {GraphQLJSONObject} from "graphql-type-json";
import mongoose from "mongoose";
// 1. Create an interface representing a document in MongoDB.
@index({ location: '2dsphere' })
@ObjectType()
export class Resource extends BaseEntity {

    @prop({ type: () => String })
    @Field(() => String)
    importId?: string;

    @prop({ type: () => String })
    @Field(() => String)
    city: string;

    @prop({ type: () => String })
    @Field(() => String)
    state: string;

    @prop({ type: () => String })
    @Field(() => String)
    country: string;

    @prop({ type: [Number], dim: 2 })
    @Field(() => [Number], { nullable: true })
    location?: number[]; //  TypegooseLocation;

    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true })
    nearestMatchDist?: number;

    @Field(() => ID, { nullable: true })
    @prop({ ref: () => Resource })
    nearestMatchResourceId?: Ref<Resource>

    @Field(() => GraphQLJSONObject, { nullable: true })
    @prop({ type: () => Schema.Types.Mixed })
    exactMatch?: { [key: string]: any };



}

// 3. Create a Model.
export const ResourceModel = getModelForClass(Resource);
Container.set('ResourceModel', ResourceModel);


export const enum ResourceSewMethods {
    IN_GARDEN = 'in_garden'
}
@InputType()
export class ResourceCreateInput implements Partial<Resource>{
    @Field(() => String)
    city: string;
}
@InputType()
export class ResourceUpdateInput extends ResourceCreateInput implements Partial<Resource>{
    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}
@InputType()
export class ResourceFilterInput implements FilterQuery<Resource>{
    @Field(() => String)
    city?: string;
}
/*@ObjectType()
export class CropSpecieDataByResourceResponseEntry {
    @Field(() => CropSpecies)
    cropSpecies: CropSpecies;

    @Field(() => Number)
    earlyStartMonth: number;

    @Field(() => Number)
    lateStartMonth: number;
}*/
@InputType()
export class CropSpecieDataByResourceInput{
    @Field(() => ID)
    ResourceId: mongoose.Schema.Types.ObjectId;

    @Field(() => [ID])
    cropSpeciesIds: mongoose.Schema.Types.ObjectId[];
}