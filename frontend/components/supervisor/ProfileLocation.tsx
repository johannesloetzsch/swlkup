import { useTranslation, Trans } from 'react-i18next';
import { useLocationStore } from '../../lib/geo/LocationStore'
import constants from '../../i18n/const.json'
import { useEffect } from 'react'
import { Supervisors } from '../../codegen/generates'
import { LocationForm } from '../../components/shared/LocationForm'

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
  const { setLocationFromDB } = useLocationStore()
  useEffect(() => {
    setLocationFromDB({type: 'postcode', zip: supervisor?.location.zip}) // TODO
  }, [supervisor?.location])

  return (
    <>
      <LocationForm/>
      <br/>
      <GeocodingResult/>
    </>
  )
}
