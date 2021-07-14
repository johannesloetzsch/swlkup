import styles from '../styles/Supervisor.module.css'
import { Languages, LookupQuery, Supervisors } from '../codegen/generates'

function LanguageChooser({languages}: {languages: Languages[]}) {
  return (
    <div>
      { languages.map( lang => <img key={lang.id} src={lang.flag_url} title={lang.name} style={{height: "15px", paddingLeft: "5px"}}/> ) }
    </div>
  )
}

function Supervisor({supervisor, languages}: {supervisor: Supervisors, languages: Languages[]}) {
  return (
    <div className={styles.card}>
      <table style={{width: "100%"}}>
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
      </table>
      {/* <p>{supervisor.offers.join(", ")}</p> */}
      <p><i><div style={{display: "inline-block"}}>{supervisor.contacts.website} &nbsp;</div>
            <div style={{display: "inline-block"}}>{supervisor.email} &nbsp;</div>
	    <div style={{display: "inline-block"}}>{supervisor.contacts.phone}</div>
	 </i>
      </p>
    </div>
  )
}

export function LookupResult({data}: {data: LookupQuery}) {
  return (
    <div>
      {/* <LanguageChooser languages={data.languages}/> */}

      <p> The Token was created by {data.lookup.ngo.name}.</p>
      <p> {data.lookup.supervisors.length} Supervisors are available:</p>
      <div className={styles.grid}>
        {data.lookup.supervisors.map( (supervisor) => <Supervisor supervisor={supervisor} languages={data.languages} key={supervisor.email} /> )}
      </div>
    </div>
  )
}
