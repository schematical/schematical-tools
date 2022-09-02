import config from "config";
import {connect} from "mongoose";
import {buildSchema, emitSchemaDefinitionFile} from "type-graphql";
import {ResourceResolver} from "./resource/Resource.resolver";
import {UserResolver} from "./user/User.resolver";
import {Container} from "typedi";

import path from "path";

export const getApolloConfig = async () => {
    const debug = process.env.NODE_ENV === 'dev' ? true : false;
    const url = config.get<string>('db.host');
    await connect(
        url,
        {}
    );
    const schema = await buildSchema({
        resolvers: [ResourceResolver, UserResolver],
        container: Container,
        emitSchemaFile: debug ? path.resolve(__dirname, "schema.gql") : false, // debug
    });
    if (debug) {
        await emitSchemaDefinitionFile('/home/user1a/WebstormProjects/schematical-web-tools-lambda/schema.gql', schema);
    }
    const apolloConfig = {
        schema,
        introspection: true,
        playground: {
            endpoint: '/dev/graphql',
        },
        debug: debug,
        // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    }
    return apolloConfig;
}