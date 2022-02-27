import { Languages, Supervisors } from '../../codegen/generates'
import { config } from '../../config'
import styles from '../../styles/Supervisor.module.css'

export function Supervisor({supervisor, languages}: {supervisor: Supervisors, languages: Languages[]}) {
  const img_src = `${config.backend_base_url}${supervisor?.photo}`

  return (
    <div className={styles.card} id={`${supervisor.id}_${supervisor.name_full}`}>
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
              { supervisor?.photo && <img src={img_src}
                                          style={{width: "110px", minWidth: "110px",  /** enough to display 4 flags above it **/
                                                  maxHeight: "200px"}}/>
              }
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

