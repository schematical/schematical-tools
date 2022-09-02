import { ApolloServer } from 'apollo-server';
import {getApolloConfig} from "@functions/gql/apollo";
(async () => {
    const apolloConfig = await getApolloConfig();
    const server = new ApolloServer(apolloConfig);
    server.listen(8080)
})();