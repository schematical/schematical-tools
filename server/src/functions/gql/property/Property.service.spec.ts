import {Container} from "typedi";
import {PropertyService} from "./Property.service";
import {Property, PropertyCreateInput, PropertyUpdateInput} from "./Property.entity";
import {Field} from "type-graphql/dist/decorators/Field";

describe('PropertyService', () => {
    let service: PropertyService;
    beforeEach(() => {
        // service = Container.get('PropertyService');
    });
    it('should exist', () => {
        expect(service).toBeTruthy();
    });
    describe('PropertyService.list', () => {


        it('should list users', async () => {
            const entity = new PropertyUpdateInput();
            const metadataKey = 'typegoose:properties'; // Symbol("Field");
            const metaDataResults  = Reflect.getMetadata(metadataKey, PropertyUpdateInput);

            metaDataResults.forEach((r) => {

            });
        });

    });
})