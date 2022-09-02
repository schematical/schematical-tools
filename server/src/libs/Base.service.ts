import {BaseEntity} from "./Base.entity";

import {Inject} from "typedi";
import {AnyParamConstructor, BeAnObject, ReturnModelType} from "@typegoose/typegoose/lib/types";
import {FilterQuery, Schema} from "mongoose";
import {Type} from "@libs/util";
import {Types} from "mongoose";
import {Field, ID, ObjectType} from "type-graphql";
import DataLoader from "dataloader";
import _ from "lodash";
export interface iBaseService<EntityT extends BaseEntity> {
    find(query: FilterQuery<EntityT>);
    createOne(input: Partial<EntityT>): Promise<EntityT>;
    updateOne(input: Partial<EntityT>): Promise<EntityT>;
    deleteOne(input: string): Promise<DeleteResponse>;
    initDataLoader(ctx, dataLoaderNamespace?: string);
    initManyToManyDataLoader(ctx, dataLoaderNamespace?: string);
}
export function BaseService<EntityT extends BaseEntity>(
    Entity: Type<EntityT>
): Type<iBaseService<EntityT>> {
    class BaseServiceClass<T> {
        @Inject(Entity.name + 'Model')
        private model: ReturnModelType<AnyParamConstructor<EntityT>, BeAnObject>;

        async find(query: FilterQuery<EntityT>) {

            const results = await this.model.find(query);
            return results;
        }
        async createOne(input: Partial<EntityT>): Promise<EntityT> {
            return await this.model.create(input);
        }
        async updateOne(input: Partial<EntityT>): Promise<EntityT> {
            const query: FilterQuery<EntityT> = {
                _id: Types.ObjectId.createFromHexString(input._id.toString())
            };
            const entity = await this.model.findOne(query);
            if (!entity) {
                throw new Error('No entity found with id: ' + input._id + "\n" + JSON.stringify(query));
            }
            /*const metadataKey = 'typegoose:properties'; // Symbol("Field");
            const metadata  = Reflect.getMetadata(metadataKey, input);

            if (!metadata) {
                console.error(input);
                throw new Error('No metadata found: \n' + JSON.stringify(input, null, 3));
            }*/
            Object.keys(input).forEach((key) => {
                if (input[key] !== undefined) {
                    entity[key] = input[key];
                }
            });
            return await entity.save();
        }
        async deleteOne(input: string): Promise<DeleteResponse> {
            const query: FilterQuery<EntityT> = {
                _id: Types.ObjectId.createFromHexString(input)
            };
            const response = await this.model.deleteOne(query);


            return Promise.resolve({ deletedCount: response.deletedCount });
        }
        /*
        HELPERS
         */
        initDataLoader(ctx, dataLoaderNamespace?: string) {
            dataLoaderNamespace = dataLoaderNamespace || Entity.name + ':DataLoader';
            ctx.dataLoaders = ctx.dataLoaders || [];
            ctx.dataLoaders[dataLoaderNamespace] = ctx.dataLoaders[dataLoaderNamespace] || new DataLoader(async (ids) => {


                const entities = await this.find({
                    _id: {
                        $in: ids
                    }
                });

                return ids.map((id:any) => {

                    const foundEntity = entities.find((c) => {
                        return id.equals(c._id);
                    });
                    if (!foundEntity) {
                        throw new Error("Could not find a species for: " + id);
                    }
                    return foundEntity;

                });
            });
            return ctx.dataLoaders[dataLoaderNamespace];
        }
        initManyToManyDataLoader(ctx, dataLoaderNamespace?: string) {
            dataLoaderNamespace = dataLoaderNamespace || Entity.name + ':ManyToManyDataLoader';
            ctx.dataLoaders = ctx.dataLoaders || [];
            ctx.dataLoaders[dataLoaderNamespace] = ctx.dataLoaders[dataLoaderNamespace] || new DataLoader(async (ids) => {
                const flatIds = _.flatten(ids);

                const entities = await this.find({
                    _id: {
                        $in: flatIds
                    }
                });

                return ids.map((ids:any) => {
                    return ids.map((id) => {
                        const foundEntity = entities.find((c) => {
                            return id.equals(c._id);
                        });
                        if (!foundEntity) {
                            throw new Error("Could not find a species for: " + id);
                        }
                        return foundEntity;
                    });

                });
            });
            return ctx.dataLoaders[dataLoaderNamespace];
        }
    }

    return BaseServiceClass;
}
@ObjectType()
export class DeleteResponse {
    @Field(() => Number, { nullable: true})
    deletedCount: number;
}