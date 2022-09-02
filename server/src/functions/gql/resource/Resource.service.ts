import "reflect-metadata";
import { Container, Inject, Service } from "typedi";
import {
  Resource,
} from "./Resource.entity";
import * as fs from "fs";
import { BaseService } from "../../../libs/Base.service";


@Service("ResourceService")
export class ResourceService extends BaseService(Resource) {
  @Inject("ResourceModel")
  private ResourceModel;

  constructor() {
    super();
  }

}
