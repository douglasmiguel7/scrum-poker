import { version } from '../../package.json'
import { EnvironmentType } from '../types'

const environment: EnvironmentType = {
  appUrl: '',
  appVersion: `v${version}`,
  appVersionTitle: 'alpha',
  githubUsername: '@douglasmiguel7',
  githubProfileUrl: 'https://github.com/douglasmiguel7',
  repositoryUrl: 'https://github.com/douglasmiguel7/scrum-poker',
  linkedInProfileUrl: 'https://www.linkedin.com/in/douglasmiguel7',
  profilePictureUrl: 'https://avatars.githubusercontent.com/u/17931093',
  tablesEndpoint: '/tables',
  contacts: [{ title: 'E-mail', value: 'douglasandrade7.dev@proton.me' }],
  firebaseOptions: {},
  appCheckSiteKey: '6Lebpn8rAAAAAIXF0BsiC16eWoLWZiBwk6VVGXX1',
}

export default environment
