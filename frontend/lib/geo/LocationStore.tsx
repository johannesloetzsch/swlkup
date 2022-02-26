import { LocationState } from './LocationState'
import { fetch_geocoding } from './geocode'
import create from 'zustand'

export const useLocationStore = create<LocationState>((set, get) => ({
  country: '',
  city: '',
  zip: '',
  setCountry: country => {set(_orig => ({country, city: '', zip: '', type: null})); get().geocode()},
  setCity: city => {set(_orig => ({city, zip: '', type: null})); get().geocode()},
  setZip: zip => {set(_orig => ({zip, type: null})); get().geocode()},
  geocode: async () => await fetch_geocoding(get(), set),
  geocode_debounce_timeout: null,
  setLocationFromDB: result => set(result),
  type: null,
  importance: null,
  display_name: '',
  lat: null,
  lon: null,
  diameter: null
}))
