import { useEffect } from 'react'
import styles from '../../styles/Supervisor.module.css'
import styles_core from '../../styles/Core.module.css'
import { Languages, LookupQuery, Supervisors, Offers } from '../../codegen/generates'
import create from 'zustand'
import { Checkbox } from '../Checkbox'
import { useTranslation, Trans } from 'react-i18next';
import constants from '../../i18n/const.json'
import { sort } from '../LanguageSelection'
import { config, fetch_config } from '../../config';
import { MailToAll } from './MailToAll'

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
            <img key={lang.id} src={lang.flag_url} title={lang.name} style={{height: "15px"}}/>&nbsp;
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
	      <p>{ t('Since you seem to be interested in a personal meeting with an supervisor, you can enter your location here, than the list of supervisors will be sorted by distance.') }</p>
               <label htmlFor="country">{ t('Country') }</label>&nbsp;
               <input type="text" name="country" id="country"/><br/>
               <label htmlFor="zip">{ t('Zip code') }</label>&nbsp;
               <input type="text" name="zip" id="zip"/>
             </span>
        }
      </fieldset><br/>
    </form>
  )
}

function Supervisor({supervisor, languages, backend_base_url}:
                    {supervisor: Supervisors, languages: Languages[], backend_base_url: URL}) {
  const img_url = `${backend_base_url}/uploads/${supervisor?.id}.jpeg`  // TODO supervisor.photo

  return (
    <div className={styles.card}>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <td><h2>{supervisor.name_full}</h2></td>
            <td style={{textAlign: "right", verticalAlign: "top"}}>
            {supervisor.languages && supervisor.languages.map( lang_id =>
              { const lang = languages[languages.findIndex( l => l.id === lang_id )]
                  return <img key={lang.id} src={lang.flag_url} title={lang.name} style={{height: "15px", paddingLeft: "5px"}}/>
            })}
               </td>
          </tr>
          <tr>
            <td>{supervisor.text}</td>
            <td style={{textAlign: "right"}}>
              { // supervisor.photo &&  /** TODO **/
		<img src={img_url} style={{width: "110px", minWidth: "110px",  /** enough to display 4 flags above it **/
                                           maxHeight: "200px"}}/> }
            </td>
          </tr>
        </tbody>
      </table>
      {/* <p>{supervisor.offers.join(", ")}</p> */}
      <p>
        <i>
          <span style={{display: "inline-block"}}>{supervisor.contacts.website} &nbsp;</span><br/>
          <span style={{display: "inline-block"}}>{supervisor.contacts.email} &nbsp;</span><br/>
          <span style={{display: "inline-block"}}>{supervisor.contacts.phone}</span>
        </i>
      </p>
    </div>
  )
}

export function LookupResult({data}: {data: LookupQuery}) {
  useEffect( () => {fetch_config() }, [config])
  const {t} = useTranslation()
  const {getLanguages, getTargets, getOffers, getContacts} = useFilterStore()
  const selectedLanguages = getLanguages(data.languages.map(lang => lang.id))
  const selectedTargets = getTargets(["individual"])
  const selectedOffers = getOffers(data.offers.map(offer => offer.id))
  const selectedContacts = getContacts([/*"inperson",*/ "remote"])  // TODO decide what the default should be
  const filteredSupervisors = data.lookup.supervisors
                             ?.filter(s => s.languages.some( (supervisorLang: string) => selectedLanguages.includes(supervisorLang) ))
                             .filter(s => s.offers.some( (supervisorOffer: string) => selectedOffers.includes(supervisorOffer) ))
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
      <div className={styles.grid}>
        {filteredSupervisors?.map( supervisor => <Supervisor supervisor={supervisor as Supervisors} languages={data.languages} backend_base_url={config.backend_base_url as any as URL} key={supervisor.id} /> )}
      </div>

      <MailToAll filteredSupervisors={filteredSupervisors as Supervisors[]}/>
    </>
  )
}
