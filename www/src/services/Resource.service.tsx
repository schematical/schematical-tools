import { gql } from "@apollo/client";
import client from "./Apollo";

import { listResource } from "./graphql";

// eslint-disable-next-line import/prefer-default-export
export class ResourceService {
  public static listResource(query: any) {
    return client
      .query({
        query: gql(listResource),
        variables: {
          input: query,
        },
        fetchPolicy: 'no-cache'
      })
      .then((response) => {
        return response?.data?.listResource;
      });
  }
}
