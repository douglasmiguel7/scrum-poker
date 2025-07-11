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
  getDocs,
  query,
  QueryConstraint,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore'
import { traceUntilFirst } from '@angular/fire/performance'
import { filter, Observable, of } from 'rxjs'
import { CollectionName } from '../../types'

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
      return reference
    }

    reference = doc(this.firestore, name, key)

    this.documentReferenceCache[entry] = reference

    return reference
  }

  getCollectionReference(name: CollectionName): CollectionReference {
    let reference = this.collectionReferenceCache[name]
    if (reference) {
      return reference
    }

    reference = collection(this.firestore, name)

    this.collectionReferenceCache[name] = reference

    return reference
  }

  getDocumentObservable<T>(name: CollectionName, key: string): Observable<T> {
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

    const reference = this.getCollectionReference(name)

    const collectionQuery = query(reference, where('id', 'in', ids))

    return collectionData(collectionQuery).pipe(traceUntilFirst('firestore'))
  }

  async getDocuments<T>(
    name: CollectionName,
    ...constraints: QueryConstraint[]
  ): Promise<T[]> {
    const reference = this.getCollectionReference(name)

    const collectionQuery = query(reference, ...constraints)

    const snapshot = await getDocs(collectionQuery)

    const snapshots = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return snapshots as T[]
  }

  async getDocumentSnapshot<T>(
    name: CollectionName,
    key: string,
  ): Promise<DocumentSnapshot<T>> {
    const reference = this.getDocumentReference(name, key)

    const snapshot = await getDoc(reference)

    return snapshot as DocumentSnapshot<T>
  }

  async exists(name: CollectionName, key: string): Promise<boolean> {
    const reference = this.getDocumentReference(name, key)

    const snapshot = await getDoc(reference)

    return snapshot.exists()
  }

  save(name: CollectionName, key: string, data: unknown): void {
    const reference = this.getDocumentReference(name, key)

    setDoc(reference, data)
  }

  update(name: CollectionName, key: string, data: unknown): void {
    const reference = this.getDocumentReference(name, key)

    updateDoc(reference, Object.assign({}, data))
  }

  async delete(name: CollectionName, key: string): Promise<void> {
    const reference = this.getDocumentReference(name, key)

    await deleteDoc(reference)
  }

  async deleteByTableId(name: CollectionName, tableId: string): Promise<void> {
    const reference = this.getCollectionReference(name)

    const collectionQuery = query(reference, where('tableId', '==', tableId))

    const snapshot = await getDocs(collectionQuery)

    const promises = snapshot.docs.map((doc) => deleteDoc(doc.ref))

    await Promise.all(promises)
  }
}
