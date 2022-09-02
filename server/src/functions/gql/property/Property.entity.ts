import 'reflect-metadata';
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, index, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";
import {FilterQuery, Schema} from "mongoose";
import {Resource} from "../resource/Resource.entity";
// 1. Create an interface representing a document in MongoDB.
@ObjectType()
export class Property extends BaseEntity {

    @prop({ type: () => String })
    @Field(() => String)
    name: string;
/*
    @Field(() => User)
    @prop({ ref: () => User })
    public ownerUserId?: Ref<User>;*/

    @Field(() => Resource)
    @prop({ ref: () => Resource })
    public ResourceId?: Ref<Resource>;

}

// 3. Create a Model.
export const PropertyModel = getModelForClass(Property);
Container.set('PropertyModel', PropertyModel);

@InputType()
export class PropertyCreateInput implements Partial<Property>{
    @Field(() => String)
    name: string;
}
@InputType()
export class PropertyUpdateInput extends PropertyCreateInput implements Partial<Property>{
    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}
@InputType()
export class PropertyFilterInput implements FilterQuery<Property>{
    @Field(() => String, { nullable: true})
    name?: string;
}