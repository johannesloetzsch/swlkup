import styles from '../styles/Supervisor.module.css'
import { Languages, LookupQuery, Supervisors } from '../codegen/generates'
import create from 'zustand'

type Options = undefined | any //Map<string, boolean>

function keysWhereVal(o:Options) {
  return !o ? undefined : Object.keys(o).filter(k=>o[k])
}

interface FilterState {
  languages: Options,
  setLanguage: (e:Event) => void,
  getLanguages: (all: string[]) => Options
}

const useFilterStore = create<FilterState>((set, get) => ({
  languages: undefined,
  setLanguage: e => set( orig => { const target: HTMLInputElement = e.target as any
                                   let languages = orig.languages || {}
                                   languages[target.value] = target.checked
                                   return {languages} as FilterState }),
  getLanguages: (all) => keysWhereVal( get().languages ) || all
}))

function FilterForm({languages}: {languages: Languages[]}) {
  const {setLanguage} = useFilterStore()
  return (
    <form>
      <fieldset>
        <legend>Only show supervisors speaking one of this languages</legend>
        { languages.map( lang => (
          <span key={lang.id}>
            <input type="checkbox" name="language" value={lang.id} id={lang.id} onClick={setLanguage} />
            <label htmlFor={lang.id}>
              <img key={lang.id} src={lang.flag_url} title={lang.name} style={{height: "15px"}}/>&nbsp;
              {lang.name}
            </label>&nbsp;&nbsp;&nbsp;
          </span>
        ) ) }
      </fieldset><br/>
      <fieldset>
        <legend>What kind of offers are you looking for?</legend>
        <input type="checkbox" name="target" value="individual" id="individual" />
        <label htmlFor="individual">Individual</label>
        <input type="checkbox" name="target" value="group" id="group" />
        <label htmlFor="individual">Group</label>
      </fieldset><br/>
      <fieldset>
        <legend>How would you like to get support?</legend>
        <input type="checkbox" name="contact" value="inperson" id="inperson" />
        <label htmlFor="inperson">In person</label>
        <input type="checkbox" name="contact" value="remote" id="remote" />
        <label htmlFor="remote">Remote (via phone)</label>
      </fieldset><br/>
    </form>
  )
}

function Supervisor({supervisor, languages}: {supervisor: Supervisors, languages: Languages[]}) {
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
              {supervisor.photo && <img src={supervisor.photo} style={{maxWidth: "100px", maxHeight: "200px"}}/>}
            </td>
          </tr>
        </tbody>
      </table>
      {/* <p>{supervisor.offers.join(", ")}</p> */}
      <p>
        <i>
          <span style={{display: "inline-block"}}>{supervisor.contacts.website} &nbsp;</span>
          <span style={{display: "inline-block"}}>{supervisor.email} &nbsp;</span>
          <span style={{display: "inline-block"}}>{supervisor.contacts.phone}</span>
        </i>
      </p>
    </div>
  )
}

export function LookupResult({data}: {data: LookupQuery}) {
  const {getLanguages} = useFilterStore()
  const visibleLanguages = getLanguages(data.languages.map(lang => lang.id))
  const filteredSupervisors = data.lookup.supervisors
                             .filter(s => s.languages.some( (supervisorLang: string) => visibleLanguages.includes(supervisorLang) ))
  return (
    <>
      <div>
        <p> The Token was created by {data.lookup.ngo.name}.</p>
        <p> {data.lookup.supervisors.length} Supervisors are available. You can use the following options to filter them:</p><br/>
        <FilterForm languages={data.languages}/>
        <p> {filteredSupervisors.length} Supervisors match this filters: </p>
      </div>

      <div className={styles.grid}>
        {filteredSupervisors.map( (supervisor) => <Supervisor supervisor={supervisor} languages={data.languages} key={supervisor.email} /> )}
      </div>
    </>
  )
}
