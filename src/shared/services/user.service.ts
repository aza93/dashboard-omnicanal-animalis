import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from 'src/shared/models/user';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UserService {

  private httpHeaders = new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Method': 'GET, POST, OPTIONS, DELETE',
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, Authorization"
  });


  constructor(private http: HttpClient, public afAuth: AngularFireAuth, private afs: AngularFirestore) {
  }

  /*
  getAll() {
    return this.http.get<User[]>(this.url + `users/list`);
  }
  */

  register(user: User) {    
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
    .then((result) => {
      this.afs.collection('stores').add({
        name: user.store,
        user_id: result.user.uid
      });
    })
  }
}