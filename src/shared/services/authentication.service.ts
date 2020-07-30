import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/shared/models/user'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificationService } from './notification.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {  
  private headers = new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Method': 'GET, POST, OPTIONS, DELETE',
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, Authorization, cookie"
  });
  private options = { headers: this.headers };

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    public http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private notifyService : NotificationService) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(user: User) {    
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
    .then((result) => {
      this.afs.collection('stores').add({
        name: user.store,
        user_id: result.user.uid
      });
      this.notifyService.showSuccess("Successfully signed up!", "Sign up")
    })
  }

  /* Sign in (firebase) */
  login(user: User) {
    this.loginMagento();
    const req = this.afAuth.signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        this.notifyService.showSuccess("Successfully signed in!", "Login")
        //console.log('Successfully signed in!');
        user.token = localStorage.getItem('magentoAdminToken');
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        var currentUserId = res.user.uid;
        const query = this.afs.firestore.collection('stores').where('user_id', '==', currentUserId);

        query.get().then(querySnapshot => {
          querySnapshot.forEach(function (doc) {
            const storeName = doc.data()['name'];
            //console.log(storeName);
            if (storeName != null) {
              //console.log('not empty');
              localStorage.setItem("store", storeName['name']);
            }
            else {
              //console.log('empty');
              localStorage.setItem("store", null);
            }
          })
        });

        this.router.navigate(['/home']);

        return user;
      })
      .catch(err => {
        this.notifyService.showError(err.message, "Something is wrong");
        //console.log('Something is wrong:',err.message);
      });
    

    return req;
  }

  loginMagento() {
    this.http.post<any>(`${environment.apiUrlMagento}/rest/V1/integration/admin/token`, { username: environment.magentoUsername, password: environment.magentoPassword }, this.options)
    .pipe(first())
    .subscribe(
      response => {
        localStorage.setItem('magentoAdminToken', response);
      },
      error => {
      });
  }

  logout() {
    //this.afAuth.signOut();
    this.dialog.closeAll();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('store');
    //localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentUserToken(): string {
    return this.currentUserSubject.value.token;
    
    //return localStorage.getItem("magentoAdminToken");
  }
}
