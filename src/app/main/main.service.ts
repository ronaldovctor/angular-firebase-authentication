import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Person } from './models/Person';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private peopleCollection: AngularFirestoreCollection<Person> = this.afs.collection('people')

  constructor(private afs: AngularFirestore) { }

  getPeople(): Observable<Person[]> {
    return this.peopleCollection.valueChanges();
  }

  addPerson(p: Person) {
    this.peopleCollection.add(p)
  }
}
