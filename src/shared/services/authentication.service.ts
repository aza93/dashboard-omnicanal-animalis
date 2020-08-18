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
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {  
  private headers = new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Method': 'GET, POST, OPTIONS, DELETE',
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, Authorization, cookie",
    //'Set-Cookie': 'cross-site-cookie=name; SameSite=None; Secure',
    'Content-Type': 'application/json',
  });
  private options = { headers: this.headers };

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private md5 = new Md5();
  private currentUserPassword: string;

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
      this.afs.collection('users').add({
        admin: user.admin,
        email: user.email,
        password: user.password,
        user_id: result.user.uid

      });
      this.notifyService.showSuccess("Utilisateur enregistré correctement", "Succès");
    })
  }

  /* Sign in (firebase) */
  login(user: User) {
    this.loginMagento();
    const req = this.afAuth.signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        this.notifyService.showSuccess("Successfully signed in!", "Login");
        
        localStorage.setItem("currentUserId", res.user.uid);
        this.saveUserRole();

        //console.log('Successfully signed in!');
        user.token = localStorage.getItem('magentoAdminToken');
        this.currentUserPassword = user.password;
        user.password = this.md5.appendStr(user.password).end().toString();
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        //this.currentUserId = res.user.uid;
        const query = this.afs.firestore.collection('stores').where('user_id', '==', res.user.uid);

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

  saveUserRole() {
    let query = this.afs.firestore.collection('users'); // 7ZXdCwkNiLNskGznt0y64wiBW7j1

    query.get().then(querySnapshot => {
      querySnapshot.forEach(function (doc) {
        if (doc.data()['user_id'] === localStorage.getItem("currentUserId"))
          localStorage.setItem("isThisUserAdmin", doc.data()['admin']+"");
          localStorage.setItem("pageSize", localStorage.getItem("isThisUserAdmin") === "true" ? environment.pageSizeAdmin+"" : environment.pageSize+"");
      })
    });
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
    localStorage.removeItem('userTabLocation');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('isThisUserAdmin');
    localStorage.removeItem('pageSize');

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

  public getUsers(): User[] {
    let users: User[] = [];
    let query = this.afs.firestore.collection('users');

    query.get().then(querySnapshot => {
      querySnapshot.forEach(function (doc) {
        let user: User = new User(doc.data()['email'], doc.data()['password']);
        user.id = doc.data()['user_id'];
        user.admin = doc.data()['admin'];
        users.push(user);
      })
    });
      
    return users;
  }

  /*
  public getUsers1(): Observable<User[]> {
    let users: User[] = [];
    let query = this.afs.firestore.collection('users');

    return query.get().pipe(map((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        let user: User = new User(doc.data()['email'], doc.data()['password']);
        user.id = doc.data()['user_id'];
        user.admin = doc.data()['admin'];
        users.push(user);
      })
      return user;
    }));

  }
  */

  updateUser(currentPassword: string, newUser: User) {
    if (currentPassword !== this.currentUserPassword)
      this.notifyService.showError("Le mot de passe actuel n'est pas accepté!", "Erreur");
    else {
      this.afAuth
      .signInWithEmailAndPassword(this.currentUserValue.email, this.currentUserPassword)
      .then(function(userCredential) {
          userCredential.user.updateEmail(newUser.email);
          userCredential.user.updatePassword(newUser.password);
      })

      /*
      var ref = new Firebase('https://<instance>.firebaseio.com');
      ref.changeEmail({
          oldEmail: 'kato@domain.com',
          newEmail: 'kato2@kato.com' ,
          password: '******'
      }, function(err) {
          console.log(err ? 'failed to change email: ' + err : 'changed email successfully!');
      });
      */
    }
  }
}
