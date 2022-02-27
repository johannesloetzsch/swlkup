import { useTranslation } from 'react-i18next'
import { useLocationStore } from '../../lib/geo/LocationStore'
import { Supervisors } from '../../codegen/generates'
import { MapContainer, MapConsumer, TileLayer, Circle, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const radius_default_km = 25
const radium_minimum_km = 5
const radius_maximum_km = 100  // only applied to supervisors

function radius(diameter_km: number|null|undefined) {
  return 1000* Math.max(radium_minimum_km,
                        diameter_km && diameter_km/2 || radius_default_km)
}

export default function LocationResult({filteredSupervisors}: {filteredSupervisors: Supervisors[]}) {
  const { t } = useTranslation()

  const { lon, lat, diameter, type } = useLocationStore()
  const zoom = !diameter || diameter > 200 && type === 'administrative' ? 5 : 8  // In future we might fit the bounding box that includes the user + closest supervisors.

  const supervisorsWithLocation = filteredSupervisors.filter(s => s.location.lat && s.location.lon)

  return ( 
    <>
      { lat && lon &&
        <MapContainer center={[lat, lon]} zoom={zoom} style={{width:"100%", height:"50vh"}}>
          <MapConsumer>
            {(map) => { /** MapContainer on rerendering keeps the old ref, so we need change this options explicitly. **/
  		      lon && lat && map.setView([lat, lon], zoom)
                        return null
                      }}
          </MapConsumer>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
          <Circle center={[lat, lon]}
                  radius={radius(diameter)}
                  pathOptions={{color: 'grey'}}>
            <Popup>{ t('Your approximate location') }</Popup>
          </Circle>
  
          {supervisorsWithLocation.map(s =>
            <Circle key={s.id}
                    center={[s.location.lat as number, s.location.lon as number]}
                    radius={Math.min(radius(radius_maximum_km), radius(s.location.diameter))}
                    pathOptions={{color: 'green'}}>
              <Popup><a href={`#${s.id}_${s.name_full}`}>{ s.name_full }</a></Popup>
            </Circle>
  	  )}
        </MapContainer>
      }
      <br/>
    </>
  )
}
