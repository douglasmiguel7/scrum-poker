import { version } from '../../package.json'
import { EnvironmentType } from '../types'

const phoneNumber = '5511936183634'

const environment: EnvironmentType = {
  appUrl: '',
  githubUsername: '@douglasmiguel7',
  githubProfileUrl: 'https://github.com/douglasmiguel7',
  repositoryUrl: 'https://github.com/douglasmiguel7/scrum-poker',
  linkedInProfileUrl: 'https://www.linkedin.com/in/douglasmiguel7',
  phoneNumber: `+${phoneNumber}`,
  email: 'douglasandrademiguel@gmail.com',
  profilePictureUrl: 'https://avatars.githubusercontent.com/u/17931093',
  tablesEndpoint: '/tables',
  appVersion: version,
  whatsappUrl: `https://wa.me/${phoneNumber}`,
  contacts: [
    { title: 'Telefone', value: `+${phoneNumber}` },
    { title: 'E-mail', value: 'douglasandrademiguel@gmail.com' },
  ],
}

export default environment
