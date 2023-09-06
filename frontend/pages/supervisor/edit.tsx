import { useEffect } from 'react'
import styles_core from '../../styles/Core.module.css'
import { Login, useAuthStore, AuthState, jwtFromLocalStorage } from '../../components/Login'
import { useSupervisorGetQuery, Offers, SupervisorInput, Supervisors } from '../../codegen/generates'
import { fetcher } from '../../codegen/fetcher'
import { useTranslation, Trans } from 'react-i18next';
import { TFunction } from 'i18next'
import constants from '../../i18n/const.json'
import { sort } from '../../components/LanguageSelection'
import { ProfileStatus } from '../../components/supervisor/ProfileStatus'
import { ProfileLocation } from '../../components/supervisor/ProfileLocation'
import { ProfilePictureUpload } from '../../components/supervisor/ProfilePictureUpload'
import { useLocationStore } from '../../lib/geo/LocationStore'
import { config } from '../../config';
import { flag } from '../../lib/urls'

function filter_empty_vals(map: object) {
  return Object.fromEntries(Object.entries(map).filter(kv => kv[1]))
}

function has_errors(error_map: object|undefined) {
  return error_map && Object.entries(error_map).length
}

function setCustomValidity(error_map:object) {
  for(const [name, error] of Object.entries(error_map)) {
    const el = (document.getElementsByName(name)[0] as HTMLInputElement)
    el?.setCustomValidity(error)
  }
}

/** Once submitting the profile form, we jump to the top, where the ProfileStatus is displayed. **/
function jump_top() {
  location.href = '#'
}

function validate() {
  const form = document.getElementById('supervisor_form') as HTMLFormElement
  const formData = form && new FormData(form)
  const formObject = form && Object.fromEntries(formData)
  const formArray = form && Array.from(formData)
  const supervisor = {deactivated: false,  /** When pressing `Save and Publish`, the profile will be activated **/
	              name_full: formObject?.name_full as string,
	              text_job_title: formObject?.text_job_title as string,
	              text_specialization: formObject?.text_specialization as string,
                      text: formObject?.text as string,
		      experience: formObject?.experience as string,
                      contacts: {'phone': formObject?.phone as string,
			         'email': formObject?.email as string,
			         'website': formObject?.website as string},
		      //location: {'zip': formObject?.zip},
                      languages: formArray?.filter(x => x[0] == 'language').map(x => x[1]) as string[],
                      offers: formArray?.filter(x => x[0] == 'offer').map(x => x[1]) as string[],
                      ngos: formObject?.all_ngos === 'true' ? 'any' : formArray?.filter(x => x[0] == 'ngos').map(x => x[1]) as string[],
                      wants_newsletter: Boolean(formObject?.wants_newsletter) }

  const errors = {email: supervisor.contacts.phone || supervisor.contacts.email ? '' : 'Please provide a phone number or an email address.',
                  language: supervisor.languages?.length ? '' : 'Please select at least one language.',
                  offer: supervisor.offers?.length ? '' : 'Please select at least one offer.',
              	  all_ngos: supervisor.ngos?.length ? '' : 'Please select the NGOs you want support or choose the option `Any`.'}

  setCustomValidity(errors)

  const errors_filtered = filter_empty_vals(errors)
  const result = !has_errors(errors_filtered)
		 ? {data: {supervisor}}
	         : {data: {supervisor},
	            errors: filter_empty_vals(errors)}
  return result
}

async function mutate(auth: AuthState, supervisor: SupervisorInput) {
  const result = await fetcher<any, any>(`mutation update($auth: Auth, $supervisor: SupervisorInput) {
                                            supervisor_update(auth: $auth, supervisor_input: $supervisor) }`,
                                         {auth, supervisor})()
  return result?.supervisor_update
}

function offer_options(t: TFunction, offers: Offers[], supervisor: any) {
  return offers.sort((o1, o2) => o1.idx - o2.idx)
	       .map( offer => (
          <label key={offer.id}>
            <input type="checkbox" name="offer" value={offer.id} id={offer.id} defaultChecked={supervisor?.offers.includes(offer.id)} onChange={validate} />
            <Trans i18nKey={offer.id as string}/><br/>
	    <div className={styles_core.explanation} style={{paddingLeft: "14px"}}> {/** padding is required to behave like Checkbox in LookupResult **/}
              {t(`${offer.id}_desc`)}
	    </div>
          </label>
        ))
}

export default function SupervisorEdit() {
  const {t} = useTranslation()

  const auth = useAuthStore()
  useEffect(() => {
    auth.setJwt(jwtFromLocalStorage())
  }, [auth.jwt])

  const {data, remove, refetch} = useSupervisorGetQuery({auth}, {enabled: Boolean(auth.jwt)})
  const supervisor = data?.supervisor_get

  const { country, city, zip, type, importance, display_name, lat, lon, diameter } = useLocationStore()

  useEffect(() => {
    /** When the mutation was successfull, we want check the new data from the db,
        so we refetch the data and then reset the form.
        After resetting, we see the new defaultValues. **/
    (document.getElementById('supervisor_form') as HTMLFormElement)?.reset()
    validate()
  }, [supervisor])

  const default_any_ngo = Boolean(!supervisor || supervisor.ngos === 'any')

  return (
    <>
      <Login /><br/>

      { <ProfileStatus supervisor={supervisor as Supervisors|undefined}/> }

      { data && data.ngos && <>
        <div>
          <Trans i18nKey="introduction_supervisor" values={constants}>text <a href={constants.url_privacy_policy}>privacy_policy</a></Trans>
        </div>
        <br/><br/>

        <form onSubmit={ async event => { event.preventDefault()
		                          const {data, errors} = validate()
		                          remove()  /** we want delete the cache between calculation based on this data and mutation **/
					  const mutated = !has_errors(errors)
					                  && await mutate(auth, {...data.supervisor,
							                         location: {country, city, zip, type, importance, display_name, lat, lon, diameter}})
					  mutated && refetch()
	                                  mutated && jump_top() }
                       } id="supervisor_form">
  
          <fieldset>
            <legend>{ t('For which ngos are you offering your services?') }</legend>
  	    <table><tbody>
  	      <tr>
	        <td>
		  <label>
                    <input type="radio" name="all_ngos" value="true" defaultChecked={default_any_ngo} onChange={validate} onClick={validate}/>
		    { t('Any') }
		  </label>
		</td>
		<td></td>
  	      </tr>
  	      <tr>
	        <td>
		  <label>
                    <input type="radio" name="all_ngos" value="false" defaultChecked={!default_any_ngo} id="all_ngos_false" onChange={validate} onClick={validate}/>
		    { t('Only this explicitly selected') }
                  </label>
                </td>
  	        <td>
  	          {data.ngos.map(ngo => { return (
  		    <label key={ngo.id as string}>
                      <input type="checkbox" name="ngos" value={ngo.id as string}
		             defaultChecked={typeof(supervisor?.ngos) === 'object' && supervisor?.ngos.includes(ngo.id)}
			     onClick={() => { (document.getElementById('all_ngos_false') as HTMLInputElement).checked = true }}
                             onChange={validate}/>
                      {ngo.name}<br/>
                    </label>
  	          )})}
		</td>
	      </tr>
  	    </tbody></table>
          </fieldset><br/>

          <fieldset>
            <legend>{ t('Languages you speak') }</legend>
            { sort(data.languages).map( lang => (
              <label key={lang.id}>
                <input type="checkbox" name="language" value={lang.id} id={lang.id} defaultChecked={supervisor?.languages.includes(lang.id)} onChange={validate} />
                <img key={lang.id} src={flag(config.base_url, lang.id)} title={lang.name} style={{height: "15px"}}/>&nbsp;
	        <span className="bidi-isolate">{lang.name}</span>&nbsp;
              </label>
            ) ) }
          </fieldset><br/>
  
          <fieldset>
            <legend>{ t('What kind of offers are you providing?') }</legend>
            <table><tbody>
	      <tr>
	        <td>{ t('For individuals') }</td>
                <td>{ offer_options(t, data.offers.filter(offer => offer.target === 'individual'), supervisor) }</td>
	      </tr>
	      <tr>
                <td>{ t('For groups') }</td>
                <td>{ offer_options(t, data.offers.filter(offer => offer.target === 'group'), supervisor) }</td>
	      </tr>
	    </tbody></table>
          </fieldset><br/>
  
          <fieldset>
            <legend>{ t('General information') }</legend>
	    <table><tbody>
	      <tr>
	        <td>{ t('Name') }</td>
                <td><input type="text" name="name_full" defaultValue={supervisor?.name_full || undefined} required={true}/></td>
	      </tr>
	      <tr>
		<td>{ t('job_title') }</td>
                <td style={{width: "50%"}}>
		  <input type="text" name="text_job_title" defaultValue={supervisor?.text_job_title || undefined} required={false /*TODO*/}/>
		</td>
	      </tr>
	      <tr>
		<td colSpan={2}>
		  <div className={styles_core.explanation}>
		    { t('job_title_examples') }
		  </div>
		</td>
	      </tr>
	      <tr>
		<td>{ t('Specialization') }</td>
                <td style={{width: "50%"}}>
		  <input type="text" name="text_specialization" defaultValue={supervisor?.text_specialization || undefined} required={true}/>
		</td>
	      </tr>
	      <tr>
		<td colSpan={2}>
		  <div className={styles_core.explanation}>
		    { t('Specialization_examples') }
		  </div>
		</td>
	      </tr>
	      <tr>
		<td>{ t('Experience') }</td>
                <td style={{width: "50%"}}>
	          <select name="experience" defaultValue={supervisor?.experience || undefined} required={false /*TODO*/}>
		    { ["", "trainee", "career entrant", "experienced"].map( value =>
                      <option value={value}>{ t(value) }</option>
		    ) }
                  </select>
		</td>
	      </tr>
              <tr>
	        <td>{ t('Motivation') }</td>
                <td><textarea name="text" defaultValue={supervisor?.text || undefined} rows={4} required={true}/></td>
              </tr>
	    </tbody></table>
          </fieldset><br/>
  
          <fieldset>
            <legend><Trans i18nKey="Contact information (phone or email)">Contact information <i>(phone or email)</i></Trans></legend>
	    <table><tbody>
              <tr>
	        <td>{ t('Phone') }</td>
                <td><input type="text" name="phone" defaultValue={supervisor?.contacts.phone || undefined} onChange={validate}/></td>
	      </tr>
              <tr>
                <td>{ t('Email') }</td>
                <td><input type="text" name="email" defaultValue={supervisor?.contacts.email || undefined} onChange={validate}/></td>
              </tr>
              <tr>
	        <td>{ t('Website') }<br/><i>({ t('optional') })</i></td>
                <td><input type="text" name="website" defaultValue={supervisor?.contacts.website || undefined}/></td>
	      </tr>
            </tbody></table>
          </fieldset><br/>
  
          <fieldset>
            <legend>{ t('Location') } <i>({ t('optional') })</i></legend>
	    <ProfileLocation supervisor={supervisor as Supervisors|undefined}/>
          </fieldset><br/>

          <fieldset>
            <legend>{ t('Profile picture') } <i>({ t('optional') })</i></legend>
	    <ProfilePictureUpload/>
          </fieldset><br/>

          <div style={{textAlign: "right"}}>
	    <p>
              <label>
                <input type="checkbox" name="wants_newsletter" defaultChecked={supervisor?.wants_newsletter||undefined}/>
		{ t('I would like to receive our newsletter.') }
              </label>
	    </p>
	    <label>
              <input type="checkbox" required name="confirm_privacy_policy"/>
              <Trans i18nKey="confirm_privacy_policy" values={constants}>text <a href={constants.url_privacy_policy}>privacy_policy</a></Trans>
	    </label>&nbsp;
            <input type="submit" value={ t('Save and Publish') as string }/>
          </div>
        </form>
      </> }
    </>
  )
}
