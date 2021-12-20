import { useLanguagesQuery } from '../codegen/generates'
import i18next from 'i18next'

export default function LanguageSelection() {
  const {data, remove, refetch} = useLanguagesQuery()
  const {languages} = data || {}

  return languages && (
    <div>
     { languages.map( lang => (
         <span key={lang.id}>
           <img src={lang.flag_url} title={lang.name} style={{height: "15px"}}
	        onClick={() => i18next.changeLanguage(lang.id)}
	   />
	   &nbsp;
         </span>
       ))
     }
    </div>
  ) || ''
}
