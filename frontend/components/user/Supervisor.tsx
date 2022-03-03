import { Languages, Supervisors } from '../../codegen/generates'
import { config } from '../../config'
import styles from '../../styles/Supervisor.module.css'
import { flag } from '../../lib/urls'

/** Prevent XSS by `script` or `object` urls **/
function Sanitized_link({href}: {href: string|null|undefined}) {
  const secure = href && href.startsWith('http')
  const fallback = !secure && href && `https://${href}`
  return (
    secure && <a href={href}>{ href }</a>
           || fallback && <a href={fallback}>{ href }</a>
	   || null
  )
}

export function Supervisor({supervisor, languages}: {supervisor: Supervisors, languages: Languages[]}) {
  const id = `${supervisor.id}_${supervisor.name_full}`
  const img_src = `${config.backend_base_url}${supervisor?.photo}`

  return (
    <div className={styles.card} id={id}>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <td><h2>{supervisor.name_full}</h2></td>
            <td style={{textAlign: "right", verticalAlign: "top"}}>
            {supervisor.languages && supervisor.languages.map( lang_id =>
              { const lang = languages[languages.findIndex( l => l.id === lang_id )]
                  return <img key={lang.id} src={flag(config.base_url, lang.id)} title={lang.name} style={{height: "15px", paddingLeft: "5px"}}/>
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
          <span style={{display: "inline-block"}}><Sanitized_link href={supervisor.contacts.website}/> &nbsp;</span><br/>
          <span style={{display: "inline-block"}}>{ supervisor.contacts.email && <a href={`mailto:${supervisor.contacts.email}`}>{supervisor.contacts.email}</a>} &nbsp;</span><br/>
          <span style={{display: "inline-block"}}>{ supervisor.contacts.phone && <a href={`tel:${supervisor.contacts.phone}`}>{supervisor.contacts.phone}</a>} &nbsp;</span><br/>
        </i>
      </p>
    </div>
  )
}

