import { Login } from '../../components/Login'
import { InviteSupervisor } from '../../components/ngo/InviteSupervisor'
import { CreateToken } from '../../components/ngo/CreateToken'

export default function NgoIndex() {
  return (
    <>
      <Login/>
      <CreateToken/>
      <InviteSupervisor/>
    </>
  )
}
