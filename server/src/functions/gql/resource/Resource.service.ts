import "reflect-metadata";
import { Container, Inject, Service } from "typedi";
import {
  Resource,
} from "./Resource.entity";
import * as fs from "fs";
import { BaseService } from "../../../libs/Base.service";
import AWS  from 'aws-sdk';
import config from "config";

@Service("ResourceService")
export class ResourceService extends BaseService(Resource) {
  @Inject("ResourceModel")
  private ResourceModel;
  private ec2: AWS.EC2;

  constructor() {
    super();
    console.log("{ region: config.get<string>('aws.region')}", { region: config.get<string>('aws.region')});
    this.ec2 = new AWS.EC2({ region: config.get<string>('aws.region')})
  }

  async find(query: any) {
    var params = {
      GroupIds: [
      ]
    };

    const data = await this.ec2.describeSecurityGroups(params).promise();

    fs.writeFileSync('./tmp.json', JSON.stringify(data, null, 3));
    const resources: Resource[] = [];
    data.SecurityGroups.forEach((securityGroup: AWS.EC2.SecurityGroup) => {
      const resource = new Resource();
      resource.remoteId = securityGroup.GroupId; // TODO: Get RSRN
      resource.name = securityGroup.GroupName;
      resource.attributes = securityGroup;
      resource.deps = [];
      securityGroup.IpPermissions.forEach((ipPermission: AWS.EC2.IpPermission) => {
        ipPermission.UserIdGroupPairs.forEach((userIdGroupPair: AWS.EC2.UserIdGroupPair) => {
          resource.deps.push(userIdGroupPair.GroupId);
        });
      });
      resources.push(resource);
    });

    return resources;

  }

}
