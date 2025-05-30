import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  async signUp(user: User) {
    const cred = await createUserWithEmailAndPassword(
      this._auth,
      user.email,
      user.password
    );
    const uid = cred.user.uid;
    const userRef = doc(this._firestore, 'usuarios', uid);
    return await setDoc(userRef, {
      uid: uid,
      email: user.email,
      createdAt: new Date(),
    });
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(this._auth, user.email, user.password);
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    const cred = await signInWithPopup(this._auth, provider);
    const uid = cred.user.uid;
    const email = cred.user.email;
    const userRef = doc(this._firestore, 'usuarios', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: uid,
        email: email,
        createdAt: new Date(),
        provider: 'google',
      });
    }
    return cred;
  }
}
