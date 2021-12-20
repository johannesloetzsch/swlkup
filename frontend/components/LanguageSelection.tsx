import { useLanguagesQuery, Languages } from '../codegen/generates'
import i18next from 'i18next'

export function sort(languages:Array<Languages>) {
  return languages.sort((l1, l2) => l1.idx - l2.idx)
}

export default function LanguageSelection() {
  const {data, remove, refetch} = useLanguagesQuery()
  const {languages} = data || {}

  return languages && (
    <div>
     { sort(languages).map( lang => (
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
