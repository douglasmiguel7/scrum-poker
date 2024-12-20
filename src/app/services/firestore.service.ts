import { Injectable } from '@angular/core'
import {
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  query,
  QueryConstraint,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore'
import { traceUntilFirst } from '@angular/fire/performance'
import { filter, Observable, of } from 'rxjs'
import { CollectionName } from '../../types'
import { getCurrentDate } from '../utils/date'

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private documentReferenceCache: Record<string, DocumentReference> = {}
  private collectionReferenceCache: Record<string, CollectionReference> = {}

  constructor(private firestore: Firestore) {}

  toCacheEntry(name: CollectionName, key: string): string {
    return `${name}/${key}`
  }

  getDocumentReference(name: CollectionName, key: string): DocumentReference {
    const entry = this.toCacheEntry(name, key)

    let reference = this.documentReferenceCache[entry]
    if (reference) {
      console.log(
        getCurrentDate(),
        `document reference -> using cached "${entry}"`,
      )
      return reference
    }

    console.log(getCurrentDate(), `document reference -> creating "${entry}"`)

    reference = doc(this.firestore, name, key)

    this.documentReferenceCache[entry] = reference

    return reference
  }

  getCollectionReference(name: CollectionName): CollectionReference {
    let reference = this.collectionReferenceCache[name]
    if (reference) {
      console.log(getCurrentDate(), `collection reference -> cached "${name}"`)
      return reference
    }

    console.log(getCurrentDate(), `collection reference -> creating "${name}"`)

    reference = collection(this.firestore, name)

    this.collectionReferenceCache[name] = reference

    return reference
  }

  getDocumentObservable<T>(name: CollectionName, key: string): Observable<T> {
    console.log(getCurrentDate(), `observing document -> ${name}/${key}`)

    const reference = this.getDocumentReference(name, key)

    return docData(reference).pipe(
      traceUntilFirst('firestore'),
      filter((value) => !!value),
    )
  }

  getCollecitonObservable<T>(
    name: CollectionName,
    ...constraints: QueryConstraint[]
  ): Observable<T[]> {
    console.log(
      getCurrentDate(),
      `observing collection -> ${name} with constraints "${constraints.map((constraint) => `${constraint.type}`).join(',')}"`,
    )

    const reference = this.getCollectionReference(name)

    const collectionQuery = query(reference, ...constraints)

    return collectionData(collectionQuery).pipe(traceUntilFirst('firestore'))
  }

  getCollectionObservableByIds<T>(
    name: CollectionName,
    ...ids: string[]
  ): Observable<T[]> {
    if (!ids.length) {
      return of([])
    }

    console.log(
      `observing collection (by ids) -> ${name} where id in "${ids.join(',')}"`,
    )

    const reference = this.getCollectionReference(name)

    const collectionQuery = query(reference, where('id', 'in', ids))

    return collectionData(collectionQuery).pipe(traceUntilFirst('firestore'))
  }

  async getDocumentSnapshot<T>(
    name: CollectionName,
    key: string,
  ): Promise<DocumentSnapshot<T>> {
    console.log(getCurrentDate(), `document snapshot -> ${name}/${key}`)

    const reference = this.getDocumentReference(name, key)

    const snapshot = await getDoc(reference)

    return snapshot as DocumentSnapshot<T>
  }

  async exists(name: CollectionName, key: string): Promise<boolean> {
    console.log(getCurrentDate(), `exists -> ${name}/${key}`)

    const reference = this.getDocumentReference(name, key)

    const snapshot = await getDoc(reference)

    return snapshot.exists()
  }

  save(name: CollectionName, key: string, data: unknown): void {
    console.log(
      getCurrentDate(),
      `save -> "${name}/${key}" with "${JSON.stringify(data)}"`,
    )

    const reference = this.getDocumentReference(name, key)

    setDoc(reference, data)
  }

  update(name: CollectionName, key: string, data: unknown): void {
    console.log(
      getCurrentDate(),
      `update -> "${name}/${key}" with "${JSON.stringify(data)}"`,
    )

    const reference = this.getDocumentReference(name, key)

    updateDoc(reference, Object.assign({}, data))
  }

  delete(name: CollectionName, key: string): void {
    console.log(getCurrentDate(), `delete -> "${name}/${key}"`)

    const reference = this.getDocumentReference(name, key)

    deleteDoc(reference)
  }
}
