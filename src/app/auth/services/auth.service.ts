import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'
import { catchError, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userCollection: AngularFirestoreCollection<User> = this.afs.collection('users')

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  register(user: User): Observable<boolean> {
    return from(this.afAuth.createUserWithEmailAndPassword(user.email, user.password!))
    .pipe(
      switchMap(
        (u) => {
          return this.userCollection.doc(u.user!.uid).set({ ...user, id: u.user!.uid })
            .then(() => true);
        }
      ),
      catchError(
        (err) => throwError(() => Error(err))
      )
    )
  }

  login(email: string, password: string): Observable<User| undefined> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password))
    .pipe(
      switchMap(
        (u) => this.userCollection.doc<User>(u.user!.uid).valueChanges()
      ),
      catchError(
        (err) => throwError(() => Error(err))
      )
    )
  }

  logout() {
    this.afAuth.signOut()
  }

  getUser(): Observable<User | null | undefined> {
    return this.afAuth.authState.pipe(
      switchMap(u => (u) ? this.userCollection.doc<User>(u.uid).valueChanges() : of(null))
    )
  }

  authenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(u => (u) ? true : false)
    )
  }



  loginGoogle(): Observable<User> {
    return from(this.loginWithGoogleAccount())
  }

  async loginWithGoogleAccount(): Promise<User> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      const userCredential = await this.afAuth.signInWithPopup(provider)
      let user: User = await this.updateUserData(userCredential)
      return user
    } 
    catch (error) {
      throw new Error(error as string)
    }
  }

  async updateUserData(u: any): Promise<User> {
    try {
      const newUser: User = {
        firstName: u.user!.displayName as string,
        lastName: '', address: '', city: '', state: '',
        phone: '', mobilePhone: '', email: u.user!.email as string,
        password: '', id: u.user?.uid
      }
      await this.userCollection.doc(u.user!.uid).set(newUser)
      return newUser
    } 
    catch (error) {
      throw new Error(error as string)
    }
  }

  oldLoginGoogle(): Observable<User> {
    const provider = new firebase.auth.GoogleAuthProvider()
    return from(this.afAuth.signInWithPopup(provider))
    .pipe(
      tap((data) => console.log(data)),
      switchMap((u) => {
        const newUser: User = {
          firstName: u.user!.displayName as string,
          lastName: '', address: '', city: '', state: '',
          phone: '', mobilePhone: '', email: u.user!.email as string,
          password: '', id: u.user?.uid
        }
        return this.userCollection.doc(u.user!.uid).set(newUser).then(() => newUser)
      })
    )
  }
}
