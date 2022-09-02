import 'reflect-metadata';
import {Container, Inject, Service} from "typedi";
import {Property,} from "./Property.entity";
import * as fs from "fs";
import {BaseService} from "../../../libs/Base.service";

@Service('PropertyService')
export class PropertyService extends BaseService(Property){
    @Inject('PropertyModel')
    private PropertyModel;

    constructor(

    ) {
        super();
    }


}