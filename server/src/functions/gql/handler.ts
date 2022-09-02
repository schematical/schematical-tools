import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context} from "aws-lambda";
import {getApolloConfig} from "./apollo";

let handeler = null;
export const main = async (
    event: APIGatewayProxyEvent,
    context: Context,
    // callback: APIGatewayProxyCallback
): Promise<APIGatewayProxyHandler> => {
  if (!handeler) {

    const apolloConfig = await getApolloConfig();
    const server = new ApolloServer(apolloConfig);
    handeler = server.createHandler();
  }
  event.path = '/graphql';
  return handeler(event, context);
};
