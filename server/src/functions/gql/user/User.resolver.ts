import 'reflect-metadata';
import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";

import {Inject, Service} from "typedi";
import {UserService} from "./User.service";
import {User } from "./User.entity";
import { UserCreateInput, UserFilterInput, UserSignupWizardInput, UserUpdateInput} from "./User.types";
import {BaseResolver} from "../../../libs/Base.resolver";


@Resolver(() => User)
@Service()
export class UserResolver  extends BaseResolver(
    User,
    UserService,
    UserFilterInput,
    UserCreateInput,
    UserUpdateInput
){
    @Inject('UserService')
    private userService: UserService;
    // dependency injection

    constructor(

    ) {
      super();
    }
    @Mutation(() => {
        return User;
    })
    signUpWizard(
        @Ctx() ctx,
        @Arg(
            "input",
            () => {
                return UserSignupWizardInput;
            },
            { nullable: false }
        )
        input
    ) {
        return this.userService.signUpWizard(input);
    }


/*
    @Mutation()
    @Authorized(Roles.Admin) // auth guard
    removeRecipe(@Arg("id") id: string): boolean {
        return this.recipeService.removeById(id);
    }

    @FieldResolver()
    averageRating(@Root() recipe: Recipe) {
        return recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length;
    }*/
}