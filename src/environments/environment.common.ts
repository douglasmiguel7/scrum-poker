import { version } from '../../package.json'
import { EnvironmentType } from '../types'

const environment: EnvironmentType = {
  appUrl: '',
  appVersion: `v${version}`,
  appVersionTitle: 'alpha',
  tablesEndpoint: '/tables',
  firebaseOptions: {},
  appCheckSiteKey: '6Lebpn8rAAAAAIXF0BsiC16eWoLWZiBwk6VVGXX1',
}

export default environment
