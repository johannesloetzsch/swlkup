import { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../components/Login'
import { useSupervisorGetPhotoQuery } from '../../codegen/generates'
import { config, fetch_config } from "../../config";

function upload_profile_picture(jwt: String, upload_url: URL, refetch: any) {
  const files = (document.getElementById('profilePicture') as HTMLInputElement).files as any as File[]
  if(!files)
    return
  const file = files[0]

  var formData = new FormData
  formData.append('upload', file)

  var req = new XMLHttpRequest
  req.onreadystatechange = () => { req.readyState === 4 && req.status === 200 && refetch() }
  req.open('POST', upload_url, true);
  req.setRequestHeader('Authorization', `Bearer ${jwt}`)
  req.send(formData);
}

export function ProfilePictureUpload() {
  useEffect( () => {fetch_config() }, [config])

  const {t} = useTranslation()
  const auth = useAuthStore()

  /** We use a separate query for the profile picture. This allows refetching without compromising unsubmitted changes in the form. **/
  const {data, refetch} = useSupervisorGetPhotoQuery({auth}, {enabled: Boolean(auth.jwt)})
  const photo = data?.supervisor_get?.photo

  const upload_url = `${config.backend_base_url}/api/upload-supervisor-picture` as any as URL
  const img_src = `${config.backend_base_url}${photo}`

  return (
    <>
      <div style={{display: "inline-block"}}>
        <input type="file" id="profilePicture" name="upload" accept="image/jpeg"/><br/>
        <input type="button" value={ t('Upload') as string } onClick={ () => upload_profile_picture(auth.jwt, upload_url, refetch) } />
      </div>
      { photo && <img src={img_src} style={{maxHeight: "100px", maxWidth: "50%", verticalAlign: "middle"}}/> }
    </>
  )
}
