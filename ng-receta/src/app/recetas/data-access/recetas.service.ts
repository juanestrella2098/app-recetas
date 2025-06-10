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
  where,
} from '@angular/fire/firestore';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

export interface Receta {
  id: string;
  titulo: string;
  descripcion: string;
  ingredientes: string[];
  pasos: string[];
  publico: boolean;
  nivelDificultad: 'fácil' | 'media' | 'difícil';
  tiempoElaboracion: number;
  valoracion: number;
  totalVotos: number;
  totalPuntos: number;

  comentarios: string[];
  userId: string;
}

export type RecetaCreate = Omit<
  Receta,
  'id' | 'valoracion' | 'comentarios' | 'userId'
>;

const PATH = 'recetas';

//Usarios

export interface Usuario {
  uid: string;
  email: string;
  createdAt: Date;
  provider?: string;
}

@Injectable()
export class RecetasService {
  private _firestore = inject(Firestore);

  private _authState = inject(AuthStateService);

  private _collection = collection(this._firestore, PATH);
  private _query = query(
    this._collection,
    where('userId', '==', this._authState.currentUser?.uid)
  );

  loading = signal<boolean>(true);

  getRecetas = toSignal(
    (
      collectionData(this._query, { idField: 'id' }) as Observable<Receta[]>
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

  constructor() {}

  // Recetas

  getReceta(id: string) {
    const docRef = doc(this._collection, id);
    return getDoc(docRef);
  }

  create(receta: RecetaCreate) {
    return addDoc(this._collection, {
      ...receta,
      valoracion: 0,
      totalVotos: 0,
      totalPuntos: 0,
      comentarios: [],
      userId: this._authState.currentUser?.uid,
    });
  }

  update(receta: RecetaCreate, id: string) {
    const docRef = doc(this._collection, id);
    return updateDoc(docRef, {
      ...receta,
      userId: this._authState.currentUser?.uid,
    });
  }

  delete(id: string) {
    const docRef = doc(this._collection, id);
    return deleteDoc(docRef);
  }

  updateComentarios(id: string, comentarios: string[]) {
    const docRef = doc(this._collection, id);
    return updateDoc(docRef, { comentarios });
  }

  getRecetasPublicas = toSignal(
    (
      collectionData(query(this._collection, where('publico', '==', true)), {
        idField: 'id',
      }) as Observable<Receta[]>
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

  async votarReceta(id: string, puntuacion: number) {
  const docRef = doc(this._collection, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return;

  const data = snapshot.data() as Receta;
  const totalPuntos = (data.totalPuntos || 0) + puntuacion;
  const totalVotos = (data.totalVotos || 0) + 1;
  const valoracion = Math.floor(totalPuntos / totalVotos);

  return updateDoc(docRef, {
    totalPuntos,
    totalVotos,
    valoracion,
  });
}


  // Usuarios

  getUsuarios(): Observable<Usuario[]> {
    const usuariosRef = collection(this._firestore, 'usuarios');
    return collectionData(usuariosRef, { idField: 'uid' }) as Observable<
      Usuario[]
    >;
  }

  getRecetasPublicasDeUsuario(userId: string): Observable<Receta[]> {
    const recetasRef = collection(this._firestore, 'recetas');
    const q = query(
      recetasRef,
      where('publico', '==', true),
      where('userId', '==', userId)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Receta[]>;
  }
}