import { EnvironmentType } from '../types'
import common from './environment.common'

export const environment: EnvironmentType = {
  ...common,
  appUrl: 'https://estimeai.com.br',
  firebaseOptions: {
    projectId: 'scrum-poker-f387c',
    appId: '1:257699867582:web:d4e569c7ad67e3a8a627ef',
    storageBucket: 'scrum-poker-f387c.firebasestorage.app',
    apiKey: 'AIzaSyCmUQk2t8bBqMx4-Ysv9LAU3iTRsMvUD2c',
    authDomain: 'scrum-poker-f387c.firebaseapp.com',
    messagingSenderId: '257699867582',
    measurementId: 'G-X7CZ9EZ6FR',
  },
}
