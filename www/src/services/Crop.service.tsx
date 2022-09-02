import { gql } from "@apollo/client";
import client from "./Apollo";

import { listCropSpecies, getCropSpecieDataByGeoLocation } from "./graphql";

// eslint-disable-next-line import/prefer-default-export
export class CropService {
  public static listCropSpecies(query: any) {
    return client
      .query({
        query: gql(listCropSpecies),
        variables: {
          input: query,
        },
      })
      .then((response) => {
        return response?.data?.listCropSpecies;
      });
  }

  public static getCropSpecieDataByGeoLocation(input: any) {
    return client
      .query({
        query: gql(getCropSpecieDataByGeoLocation),
        variables: {
            input,
        },
      })
      .then((response) => {
        return response?.data?.getCropSpecieDataByGeoLocation;
      });
  }
}
