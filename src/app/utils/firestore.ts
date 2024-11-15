import { DocumentReference } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { doc, Firestore } from '@firebase/firestore'
import { getTableId } from './table'
import { getUserId } from './user'

export const getDocRef = (
  firestore: Firestore,
  collection: string,
  key: string,
): DocumentReference => {
  console.log(`retrivieng doc ref ${collection}/${key}`)
  return doc(firestore, collection, key)
}

export const getTableRef = (
  firestore: Firestore,
  route: ActivatedRoute,
): DocumentReference => getDocRef(firestore, 'tables', getTableId(route))

export const getUserRef = (firestore: Firestore): DocumentReference =>
  getDocRef(firestore, 'users', getUserId())
