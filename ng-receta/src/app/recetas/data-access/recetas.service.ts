import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from '@angular/fire/firestore';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

export interface Receta {
  id: string;
  title: string;
  completed: boolean;
}

export type RecetaCreate = Omit<Receta, 'id'>;

const PATH = 'recetas';

@Injectable()
export class RecetasService {
  private _firestore = inject(Firestore);

  private _authState = inject(AuthStateService);

  private _collection = collection(this._firestore, PATH);
  private _query = query(this._collection, where('userId', '==', this._authState.currentUser?.uid))

  loading = signal<boolean>(true);

  getRecetas = toSignal(
    (
      collectionData(this._query, { idField: 'id' }) as Observable<
        Receta[]
      >
    ).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    ),
    {
      initialValue: [],
    }
  );

  constructor(){ }

  getReceta(id: string) {
    const docRef = doc(this._collection, id);
    return getDoc(docRef);
  }

  create(receta: RecetaCreate) {
    return addDoc(this._collection, {...receta, userId:this._authState.currentUser?.uid });
  }

  update(receta: RecetaCreate, id: string) {
    const docRef = doc(this._collection, id);
    return updateDoc(docRef, {...receta, userId:this._authState.currentUser?.uid });
  }

  delete(id: string) {
    const docRef = doc(this._collection, id);
    return deleteDoc(docRef);
  }
}
