import styles from '../styles/Supervisor.module.css'
import { Languages, LookupQuery, Supervisors, Offers } from '../codegen/generates'
import create from 'zustand'
import { Checkbox } from './Checkbox'

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
  const {setLanguage, getLanguages, setTarget, getTargets, setOffer, getOffers, setContact, getContacts} = useFilterStore()
  const visibleOffers = offers.filter(o => selections.selectedTargets.includes( o.target ))
  return (
    <form>
      <fieldset>
        <legend>Only show supervisors speaking one of this languages</legend>
        { languages.map( lang => (
          <Checkbox name="language" value={lang.id} id={lang.id} onChange={setLanguage} key={lang.id}
                    refInput={el => el && (el.indeterminate = getLanguages([]).length === 0
                                       && selections.selectedLanguages.includes(lang.id))} >
            <img key={lang.id} src={lang.flag_url} title={lang.name} style={{height: "15px"}}/>&nbsp;
            {lang.name}
          </Checkbox>
        ) ) }
      </fieldset><br/>
      <fieldset>
        <legend>What kind of offers are you looking for?</legend>
        { [{"id": "individual", "label": "Individual"}, {"id": "group", "label": "Group"}].map( target => (
            <Checkbox name="target" value={target.id} id={target.id} onChange={setTarget} key={target.id}
                      refInput={el => el && (el.indeterminate = getTargets([]).length === 0
                                         && selections.selectedTargets.includes(target.id))} >
              {target.label}
            </Checkbox>
        ) ) }
        <hr/>
        { visibleOffers.map( offer => (
          <span key={offer.id}>
            <Checkbox name="offer" value={offer.id} id={offer.id} onChange={setOffer}
                      refInput={el => el && (el.indeterminate = getOffers([]).length === 0
                                         && selections.selectedOffers.includes(offer.id))} >
              {offer.desc}
            </Checkbox><br/>
          </span>
        ) ) }
      </fieldset><br/>
      <fieldset>
        <legend>How would you like to get support?</legend>
        { [{"id": "inperson", "label": "In Person"}, {"id": "remote", "label": "Remote"}].map( contact => (
            <Checkbox name="contact" value={contact.id} id={contact.id} onChange={setContact} key={contact.id}
                      refInput={el => el && (el.indeterminate = getContacts([]).length === 0
                                         && selections.selectedContacts.includes(contact.id))} >
              {contact.label}
            </Checkbox>
        ) ) }
        { selections.selectedContacts.includes("inperson")
          && <span><hr/>
               Since you seem to be interested in a personal meeting with an supervisor, you can enter your location here,<br/> than the list of supervisors will be sorted by distance.<br/>
               <label htmlFor="country">Country</label>&nbsp;
               <input type="text" name="country" id="country"/>
               &nbsp;&nbsp;&nbsp;
               <label htmlFor="zip">Zip code</label>&nbsp;
               <input type="text" name="zip" id="zip"/>
             </span>
        }
      </fieldset><br/>
    </form>
  )
}

function Supervisor({supervisor, languages}:
                    {supervisor: Supervisors, languages: Languages[]}) {
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
              {supervisor.photo && <img src={supervisor.photo} style={{maxWidth: "110px",  /** enough to display 4 flags **/
                                                                       maxHeight: "200px"}}/>}
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
        <p> The Token was created by {data.lookup.ngo?.name}.</p>
        <p> {data.lookup.supervisors?.length} Supervisors are available. You can use the following options to filter them:</p><br/>
        <FilterForm languages={data.languages} offers={data.offers}
                    selections={{selectedLanguages, selectedTargets, selectedOffers, selectedContacts}}/>
        <p> {filteredSupervisors?.length} Supervisors match this filters: </p>
      </div>

      <div className={styles.grid}>
        {filteredSupervisors?.map( supervisor => <Supervisor supervisor={supervisor as Supervisors} languages={data.languages} key={supervisor.id} /> )}
      </div>
    </>
  )
}
