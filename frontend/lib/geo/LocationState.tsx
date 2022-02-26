export interface LocationState {
  // inputs + setters
  country: string,
  city: string,
  zip: string,
  setCountry: (country: string) => void,
  setCity: (city: string) => void,
  setZip: (zip: string) => void,
  geocode: () => void,
  geocode_debounce_timeout: NodeJS.Timeout|null,
  setLocationFromDB: (result: any) => void,  // this should not trigger a geocoding request
  // geocoding result, based on https://nominatim.org/release-docs/develop/api/Output/#json
  type: 'administrative'|'city'|'postcode'|null,  // this should determine if a geocoding result is available
  importance: number|null,
  display_name: string,
  lat: number|null,
  lon: number|null,
  diameter: number|null  // calculated from boundingbox
}
