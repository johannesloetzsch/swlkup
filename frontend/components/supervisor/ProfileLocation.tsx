import { useTranslation, Trans } from 'react-i18next';
import constants from '../../i18n/const.json'
import { useEffect } from 'react'
import { Supervisors } from '../../codegen/generates'
import { useLocationStore } from '../../lib/geo/LocationStore'

function GeocodingResult() {
  const {t} = useTranslation()
  const { country, city, zip,
          type, display_name } = useLocationStore()
  //console.log(useLocationStore())
  const someInput = country || city || zip
  return (
    <>
      { !someInput &&
        <div>
          { <Trans i18nKey="note_geocoding" values={constants}>text <a href={constants.url_nominatim}>Nominatim</a></Trans> }
        </div>
      }
      { someInput && !type &&
        <div>
          { t('The location could not be found.') }
        </div>
      }
      { someInput && type &&
        <div>
          { t('The location was found:') } &nbsp;
          { display_name }
        </div>
      }
    </>
  )
}

export function ProfileLocation({supervisor}: {supervisor: Supervisors|undefined}) {
  const {t} = useTranslation()

  const { country, city, zip, setCountry, setCity, setZip, setLocationFromDB } = useLocationStore()
  useEffect(() => {
    setLocationFromDB({type: 'postcode', zip: supervisor?.location.zip}) // TODO
  }, [supervisor?.location])

  return (
    <>
      <table><tbody>
        <tr>
          <td>{ t('Country') }</td>
          <td><input type="text" name="country" value={country} onChange={e=>setCountry(e.target.value)}/></td>
        </tr>
        <tr>
          <td>{ t('City') }</td>
          <td><input type="text" name="city" value={city} onChange={e=>setCity(e.target.value)}/></td>
        </tr>
        <tr>
          <td>{ t('Zip code') }</td>
          <td><input type="text" name="zip" value={zip} onChange={e=>setZip(e.target.value)}/></td>
        </tr>
      </tbody></table>
      <br/>
      <GeocodingResult/>
    </>
  )
}
