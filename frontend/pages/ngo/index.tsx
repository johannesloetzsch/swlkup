import { Login } from '../../components/Login'
import { InviteSupervisor } from '../../components/InviteSupervisor'
import { CreateToken } from '../../components/CreateToken'

export default function NgoIndex() {
  return (
    <>
      <Login/>
      <CreateToken/>
      <InviteSupervisor/>
    </>
  )
}
