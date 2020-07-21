import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from 'src/shared/models/user';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({ providedIn: 'root' })
export class UserService {

  private httpHeaders = new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Method': 'GET, POST, OPTIONS, DELETE',
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, Authorization"
  });


  constructor(private http: HttpClient, public afAuth: AngularFireAuth) {
  }

  /*
  getAll() {
    return this.http.get<User[]>(this.url + `users/list`);
  }
  */

  register(user: User) {    
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  /*
  delete(id: string) {
    return this.http.delete(this.url + `users/` + id);

  }
  */
}