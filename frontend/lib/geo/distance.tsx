export type lon=number
export type lat=number

/** optimization by https://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error/21623256#21623256 **/
export function haversine_distance(lat1:lon, lon1: lon, lat2:lat, lon2:lon) {
  var R = 6371 // Radius of the earth in km
  var dLat = (lat2 - lat1) * Math.PI / 180  // deg2rad below
  var dLon = (lon2 - lon1) * Math.PI / 180
  var a = 0.5 - Math.cos(dLat)/2 +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon))/2
  return R * 2 * Math.asin(Math.sqrt(a))
}
