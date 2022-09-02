import {Field, ID, InputType} from "type-graphql";
import {FilterQuery, Schema} from "mongoose";
import {prop, Ref} from "@typegoose/typegoose";
import {User} from "../user/User.entity";
import {Resource} from "../resource/Resource.entity";


@InputType()
export class UserCreateInput implements Partial<User>{
    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;
}
@InputType()
export class UserUpdateInput extends UserCreateInput implements Partial<User>{
    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}
@InputType()
export class UserFilterInput implements  FilterQuery<User>{
    @Field(() => String)
    firstName?: string;

    @Field(() => String)
    lastName?: string;
}
@InputType()
export class UserSignupWizardInput implements  Partial<User>{
    @Field(() => String)
    email: string;

}
