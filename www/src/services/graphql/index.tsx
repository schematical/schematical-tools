const listCropSpecies = `
query listCropSpecies($input: CropSpeciesFilterInput!){
  listCropSpecies(input:$input) {
    _id
    importId
    name
    lowTemp
    highTemp
    sewingMethods
    otherNames
    harvestDayMin
    harvestDayMax
    maxSpacingInCM
    minSpacingInCM
    attributes
  }
}
`;
const listGeoLocations = `
query listGeoLocation($input: GeoLocationFilterInput!){
  listGeoLocation(input:$input) {
    _id
    city
    state
    country
    location
    nearestMatch{
      _id
      city
    }
}
}`;
const getCropSpecieDataByGeoLocation = `
query ($input: CropSpecieDataByGeoLocationInput) {
  getCropSpecieDataByGeoLocation(input: $input) {
    cropSpecies {
      _id
      name
      harvestDayMin
      harvestDayMax
    },
    earlyStartMonth,
    lateStartMonth
  }
}`;
export { listGeoLocations, listCropSpecies, getCropSpecieDataByGeoLocation };
