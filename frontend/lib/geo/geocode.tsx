import { LocationState } from './LocationState'
import { haversine_distance } from './distance'
import { PartialState } from 'zustand'

function parseGeocodingResult(result: any) {
  return {type: result?.type || null,
          importance: result?.importance || null,
          display_name: result?.display_name || '',
          lat: parseFloat(result?.lat) || null,
          lon: parseFloat(result?.lon) || null,
          diameter: result?.boundingbox && haversine_distance(parseFloat(result.boundingbox[0]),
	                                                      parseFloat(result.boundingbox[2]),
							      parseFloat(result.boundingbox[1]),
							      parseFloat(result.boundingbox[3]))} as PartialState<LocationState>
}

export async function fetch_geocoding(location: LocationState,
				      set: (partial: PartialState<LocationState>) => void,
				      debounce_limit_ms=1000) {
  const args_postalcode = location.zip ? `&postalcode=${encodeURIComponent(location.zip)}` : ''
  const args_city = location.city ? `&city=${encodeURIComponent(location.city)}` : ''
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&country=${encodeURIComponent(location.country)}${args_postalcode||args_city}`

  location.geocode_debounce_timeout && clearTimeout(location.geocode_debounce_timeout)
  set({geocode_debounce_timeout: setTimeout(async () => set(parseGeocodingResult((await (await fetch(url)).json())[0])),
                                    debounce_limit_ms)} as PartialState<LocationState>)
}
