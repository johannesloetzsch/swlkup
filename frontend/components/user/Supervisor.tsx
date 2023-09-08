import { Languages, Supervisors } from '../../codegen/generates'
import { config } from '../../config'
import styles from '../../styles/Supervisor.module.css'
import { flag } from '../../lib/urls'
import { useTranslation } from 'react-i18next';

/** Prevent XSS by `script` or `object` urls **/
function Sanitized_link({href, target='_blank'}: {href: string|null|undefined, target?: string|undefined}) {
  const secure = href && href.startsWith('http')
  const fallback = !secure && href && `https://${href}`
  return (
    secure && <a href={href} target={target}>{ href }</a>
           || fallback && <a href={fallback} target={target}>{ href }</a>
           || null
  )
}

export function Supervisor({supervisor, languages}: {supervisor: Supervisors, languages: Languages[]}) {
  const {t} = useTranslation()
  const id = `${supervisor.id}_${supervisor.name_full}`
  const img_src = `${config.backend_base_url}${supervisor?.photo}`

  console.log({supervisor})

  return (
    <div className={styles.card} id={id} style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', width: '100%'}}>
        <div style={{flexGrow: 1}}>
          <h2>{supervisor.name_full}</h2>
        </div>
        <div style={{textAlign: "right", verticalAlign: "top"}}>
          {supervisor.languages && supervisor.languages.map( lang_id =>
            { const lang = languages[languages.findIndex( l => l.id === lang_id )]
                return <img key={lang.id} src={flag(config.base_url, lang.id)} title={lang.name} style={{height: "15px", paddingLeft: "5px"}}/>
          })}
        </div>
      </div>
      <div style={{display: 'flex', width: '100%'}}>
        <div style={{flexGrow: 1}}>
          {(supervisor.text_job_title || supervisor.experience) &&
            <div>
              <b>{supervisor.text_job_title}</b>
              { supervisor.text_job_title && supervisor.experience ? <>&nbsp;({supervisor.experience})</> : supervisor.experience }
            </div>
          }
          {supervisor.text_specialization && <div>{supervisor.text_specialization}</div>}
          <div style={{paddingTop: '0.5em'}}>
	    <i>{supervisor.offers.map( offer => t(offer) )
                                 .join(", ")}
	    </i>
	  </div>
        </div>
        <div style={{textAlign: "right"}}>
          { supervisor?.photo && <img src={img_src}
                                      style={{width: "110px", minWidth: "110px",
                                              maxHeight: "200px"}}/>
          }
        </div>
      </div>
      <div style={{flexGrow: 1, paddingTop: '1em', paddingBottom: '1em'}}>
        {supervisor.text}
      </div>
      <div>
        <p>
          <i>
            <span style={{display: "inline-block"}}><Sanitized_link href={supervisor.contacts.website}/> &nbsp;</span><br/>
            <span style={{display: "inline-block"}}>{ supervisor.contacts.email && <a href={`mailto:${supervisor.contacts.email}`}>{supervisor.contacts.email}</a>} &nbsp;</span><br/>
            <span style={{display: "inline-block"}}>{ supervisor.contacts.phone && <a href={`tel:${supervisor.contacts.phone}`}>{supervisor.contacts.phone}</a>} &nbsp;</span><br/>
          </i>
        </p>
      </div>
    </div>
  )
}

