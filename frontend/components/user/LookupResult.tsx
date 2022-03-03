import styles from '../../styles/Supervisor.module.css'
import styles_core from '../../styles/Core.module.css'
import { Languages, LookupQuery, Supervisors, Offers } from '../../codegen/generates'
import create from 'zustand'
import { Checkbox } from '../Checkbox'
import { useTranslation, Trans } from 'react-i18next';
import constants from '../../i18n/const.json'
import { sort } from '../LanguageSelection'
import { config } from '../../config';
import { MailToAll } from './MailToAll'
import { Supervisor } from '../../components/user/Supervisor'
import { LocationForm } from '../shared/LocationForm'
import { LocationResultWithoutSSR } from './LocationResultWithoutSSR'
import { useLocationStore } from '../../lib/geo/LocationStore'
import { haversine_distance, lon, lat } from '../../lib/geo/distance'
import { flag } from '../../lib/urls'

type Options = any //Map<string, boolean>

function keysWhereVal(o:Options, initKeys: string[]) {
  if(!o) return initKeys
  const result = Object.keys(o).filter(k=>o[k])
  return result.length === 0
         ? initKeys
         : result
}

interface FilterState {
  languages: Options,
  setLanguage: (e:React.ChangeEvent<HTMLInputElement>) => void,
  getLanguages: (init: string[]) => Options,

  targets: Options,
  setTarget: (e:React.ChangeEvent<HTMLInputElement>) => void,
  getTargets: (init: string[]) => Options,

  offers: Options,
  setOffer: (e:React.ChangeEvent<HTMLInputElement>) => void,
  getOffers: (init: string[]) => Options,

  contacts: Options,
  setContact: (e:React.ChangeEvent<HTMLInputElement>) => void,
  getContacts: (init: string[]) => Options,
}

const useFilterStore = create<FilterState>((set, get) => ({
  languages: {},
  setLanguage: e => set( orig => { let languages = orig.languages
                                   languages[e.target.value] = e.target.checked
                                   return {languages} }),
  getLanguages: (init) => keysWhereVal(get().languages, init),

  targets: {},
  setTarget: e => set( orig => { let targets = orig.targets
                                 targets[e.target.value] = e.target.checked
                                 return {targets, offers: {}} }),
  getTargets: (init) => keysWhereVal(get().targets, init),

  offers: {},
  setOffer: e => set( orig => { let offers = orig.offers
                                offers[e.target.value] = e.target.checked
                                return {offers} }),
  getOffers: (init) => keysWhereVal(get().offers, init),

  contacts: {},
  setContact: e => set( orig => { let contacts = orig.contacts
                                  contacts[e.target.value] = e.target.checked
                                  return {contacts} }),
  getContacts: (init) => keysWhereVal(get().contacts, init),
}))

function FilterForm({languages, offers, selections}:
                    {languages: Languages[], offers: Offers[], selections: any}) {
  const {t} = useTranslation()
  const {setLanguage, getLanguages, setTarget, getTargets, setOffer, getOffers, setContact, getContacts} = useFilterStore()
  const location = useLocationStore()
  const visibleOffers = offers.sort((o1, o2) => o2.idx - o1.idx)
                              .sort((o1, o2) => o1.target < o2.target ? 1 : -1)
                              .filter(o => selections.selectedTargets.includes( o.target ))
  return (
    <form>
      <fieldset>
        <legend>{ t('Only show supervisors speaking one of this languages') }</legend>
        { sort(languages).map( lang => (
          <Checkbox name="language" value={lang.id} id={lang.id} onChange={setLanguage} key={lang.id}
                    refInput={el => el && (el.indeterminate = getLanguages([]).length === 0
                                       && selections.selectedLanguages.includes(lang.id))} >
            <img key={lang.id} src={flag(config.base_url, lang.id)} title={lang.name} style={{height: "15px"}}/>&nbsp;
            <span className="bidi-isolate">{lang.name}</span>
          </Checkbox>
        ) ) }
      </fieldset><br/>
      <fieldset>
        <legend>{ t('What kind of offers are you looking for?') }</legend>
        { ["individual", "group"].map( target => (
            <Checkbox name="target" value={target} id={target} onChange={setTarget} key={target}
                      refInput={el => el && (el.indeterminate = getTargets([]).length === 0
                                         && selections.selectedTargets.includes(target))} >
              {t(target)}
            </Checkbox>
        ) ) }
        <hr/>
        { visibleOffers.map( offer => (
          <span key={offer.id}>
            <Checkbox name="offer" value={offer.id} id={offer.id} onChange={setOffer}
                      refInput={el => el && (el.indeterminate = getOffers([]).length === 0
                                         && selections.selectedOffers.includes(offer.id))} >
              {t(offer.id)}
	      <div className={styles_core.explanation}>
                {t(`${offer.id}_desc`)}
	      </div>
            </Checkbox><br/>
          </span>
        ) ) }
      </fieldset><br/>
      <fieldset>
        <legend>{ t('How would you like to get support?') }</legend>
        { ["inperson", "remote"].map( contact => (
            <Checkbox name="contact" value={contact} id={contact} onChange={setContact} key={contact}
                      refInput={el => el && (el.indeterminate = getContacts([]).length === 0
                                         && selections.selectedContacts.includes(contact))} >
              {t(contact)}
            </Checkbox>
        ) ) }
        { selections.selectedContacts.includes("inperson")
          && <span><hr/>
               <p>
                 <Trans i18nKey="note_location_services" values={constants}
                        components={{1: <a href={constants.url_openstreetmap}>Openstreetmap</a>,
                                     2: <a href={constants.url_nominatim}>Nominatim</a>}}/>
		 {/** This services see the Referer header **/}
               </p>
	       <LocationForm/>
	       { (location.country || location.city || location.zip) && !location.type && <p>{ t('The location could not be found.') }</p> }
             </span>
        }
      </fieldset><br/>
    </form>
  )
}

function distance_for_known_locations(lon: lon, lat: lat, supervisor: Supervisors) {
  const location = supervisor.location
  const distance = lon && lat && location.lon && location.lat && haversine_distance(lat, lon, location.lat, location.lon)
  return distance || (distance === 0 ? 0 : Infinity)
}

export function LookupResult({data}: {data: LookupQuery}) {
  const { t } = useTranslation()
  const { getLanguages, getTargets, getOffers, getContacts } = useFilterStore()
  const { lon, lat } = useLocationStore()
  const selectedLanguages = getLanguages(data.languages.map(lang => lang.id))
  const selectedTargets = getTargets(["individual"])
  const selectedOffers = getOffers(data.offers.map(offer => offer.id))
  const selectedContacts = getContacts(["remote"])  // This default doesn't require loading loading external content (OSM) and so is the best choice to provide privacy
  const supervisorsWithDistance = (data.lookup.supervisors as Supervisors[])
                                  ?.map(s => ({...s,
					       location: {...s.location,
						          distance: distance_for_known_locations(lon as lon, lat as lat, s) }}))
  const filteredSupervisors = supervisorsWithDistance                              
	                      .filter(s => s.languages.some( (supervisorLang: string) => selectedLanguages.includes(supervisorLang) ))
                              .filter(s => s.offers.some( (supervisorOffer: string) => selectedOffers.includes(supervisorOffer) ))
			      .sort((s1, s2) => s1.location.distance - s2.location.distance)
  return (
    <>
      <div>
        <Trans i18nKey="introduction_user" values={{contact: constants.contact}}/>
      </div>

      <h3>{ t('Filter') }</h3>
      <div className="fullwidth">
	<span className="cypress"> The Token was created by {data.lookup.ngo?.name}.</span>
	<span className="cypress"> {data.lookup.supervisors?.length} Supervisors are available</span>
        <FilterForm languages={data.languages} offers={data.offers}
                    selections={{selectedLanguages, selectedTargets, selectedOffers, selectedContacts}}/>
      </div>

      <h3>{ t('Results') }</h3>
      <p className="subtitle">{ t('supervisor_matches', {count: filteredSupervisors?.length}) }</p>
      { selectedContacts.includes("inperson") && lon && lat && <LocationResultWithoutSSR filteredSupervisors={filteredSupervisors}/> }
      <div className={styles.grid}>
        {filteredSupervisors?.map( supervisor => <Supervisor supervisor={supervisor} languages={data.languages} key={supervisor.id} /> )}
      </div>

      <MailToAll filteredSupervisors={filteredSupervisors as Supervisors[]}/>
    </>
  )
}
