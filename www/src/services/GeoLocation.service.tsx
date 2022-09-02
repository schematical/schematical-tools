import { gql } from "@apollo/client";
import client from "./Apollo";

import { listGeoLocations } from "./graphql";

// eslint-disable-next-line import/prefer-default-export
export class GeoLocationService {
  public static listGeoLocations(query: any) {
    return client
      .query({
        query: gql(listGeoLocations),
        variables: {
          input: query,
        },
      })
      .then((response) => {
        return response?.data?.listGeoLocation;
      });
  }
}
