import styles from '../styles/Supervisor.module.css'

function Supervisor({supervisor}: {supervisor: any}) {
  return (
    <div className={styles.card}>
      <p><h2>{supervisor.name_full}</h2></p>
      <p>{supervisor.text}</p>
      <p><i>{supervisor.email}</i></p>
    </div>
  )
}

export function LookupResult({data}: {data: any}) {
  return (
    <div>
      <p> The Token was created by {data.lookup.ngo.name}.</p>
      <p> {data.lookup.supervisors.length} Supervisors are available:</p>
      <div className={styles.grid}>
        {data.lookup.supervisors.map( (supervisor:any) => <Supervisor supervisor={supervisor} key={supervisor.email} /> )}
      </div>
    </div>
  )
}
