import styles from '../styles/Supervisor.module.css'
import { Lookup, Supervisors } from '../codegen/generates'

function Supervisor({supervisor}: {supervisor: Supervisors}) {
  return (
    <div className={styles.card}>
      <p><h2>{supervisor.name_full}</h2></p>
      <p>{supervisor.text}</p>
      <p><i>{supervisor.email}</i></p>
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
