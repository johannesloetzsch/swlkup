import styles from '../styles/Supervisor.module.css'
import { Lookup, Supervisors } from '../codegen/generates'

function Supervisor({supervisor}: {supervisor: Supervisors}) {
  return (
    <div className={styles.card}>
      <table style={{width: "100%"}}>
        <tr>
	  <td><h2>{supervisor.name_full}</h2></td>
          <td style={{textAlign: "right"}}>
	    {supervisor.languages && supervisor.languages.map( (lang) => (<span key={lang}>{lang + " "}</span>) )}
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

export function LookupResult({lookup}: {lookup: Lookup}) {
  return (
    <div>
      <p> The Token was created by {lookup.ngo.name}.</p>
      <p> {lookup.supervisors.length} Supervisors are available:</p>
      <div className={styles.grid}>
        {lookup.supervisors.map( (supervisor) => <Supervisor supervisor={supervisor} key={supervisor.email} /> )}
      </div>
    </div>
  )
}
