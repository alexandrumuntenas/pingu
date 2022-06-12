import Event from '../../classes/Event'
import { ClientUser } from '../../client'

export default new Event('exit', () => {
  ClientUser.destroy()
  process.exit()
})
