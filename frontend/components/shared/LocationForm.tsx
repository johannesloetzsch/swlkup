import { useTranslation } from 'react-i18next';
import { useLocationStore } from '../../lib/geo/LocationStore'

export function LocationForm() {
  const {t} = useTranslation()
  const { country, city, zip, setCountry, setCity, setZip } = useLocationStore()

  return (
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
  )
}
