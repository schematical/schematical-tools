import 'reflect-metadata';
import {Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root} from "type-graphql";

import {Inject, Service} from "typedi";
import {ResourceService} from "./Resource.service";
import {BaseResolver} from "../../../libs/Base.resolver";
import {
    Resource,
    ResourceCreateInput,
    ResourceFilterInput, ResourceUpdateInput
} from "./Resource.entity";
import {HydratedDocument} from "mongoose";
@Resolver(() => Resource)
@Service()
export class ResourceResolver extends BaseResolver(
    Resource,
    ResourceService,
    ResourceFilterInput,
    ResourceCreateInput,
    ResourceUpdateInput,
){
    @Inject('ResourceService')
    private resourceService: ResourceService;
    constructor(

    ) {
        super();
    }

    @Query(
        () => {
            return [Resource];
        },
        {
            name: 'list' + Resource.name
        }
    )
    list(
        @Ctx() ctx,
        @Arg("input", () => {
            return ResourceFilterInput;
        }, { nullable: true}) input
    ) {
        let query: any = input || {};
        if (query.city) {
            query.city = {$regex:  new RegExp(`^${query.city}`, "i") };
        }
        console.log(query);
        return this.resourceService.find(query);
    }





}