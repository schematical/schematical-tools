import "reflect-metadata";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import _ from "underscore";
import { Inject, Service } from "typedi";
import {
  Property,
  PropertyCreateInput,
  PropertyFilterInput,
  PropertyUpdateInput,
} from "./Property.entity";
import { PropertyService } from "./Property.service";

import DataLoader from "dataloader";
import { HydratedDocument } from "mongoose";
import { BaseResolver } from "../../../libs/Base.resolver";

@Service()
@Resolver(() => Property)
export class PropertyResolver extends BaseResolver(
  Property,
  PropertyService,
  PropertyFilterInput,
  PropertyCreateInput,
  PropertyUpdateInput
) {
  @Inject("PropertyService")
  private PropertyService;
  constructor() {
    super();
  }

  @Query(
    () => {
      return [Property];
    },
    {
      name: "list" + Property.name,
    }
  )
  list(
    @Ctx() ctx,
    @Arg(
      "input",
      () => {
        return PropertyFilterInput;
      },
      { nullable: true }
    )
    input
  ) {
    let query: any = input || {};
    if (query.name) {
      query.name = { $regex: new RegExp(`^${query.name}`, "i") };
    } else {
      delete(query.name);
    }
    console.log(query);
    return this.PropertyService.find(query);
  }


}
