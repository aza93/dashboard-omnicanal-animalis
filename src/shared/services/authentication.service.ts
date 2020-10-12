import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, SubscribableOrPromise, Subject } from 'rxjs';
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
import { auth } from 'firebase';

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
      }).then(res => {
        let storeId;
        let query = this.afs.collection('stores');

        query.snapshotChanges().subscribe(actions => {
          let storeId;
          actions.map(b => {
            if (b.payload.doc.data()['user_id'] === result.user.uid) {
              storeId = b.payload.doc.ref.id;
            }
          });

          this.afs.collection('users').add({
            admin: user.admin,
            email: user.email,
            user_id: result.user.uid,
            store_id: storeId
          });
          this.notifyService.showSuccess("Utilisateur enregistré correctement", "Succès");
        });
      });
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
        
        //this.router.navigate(['/home']);
        this.router.navigateByUrl('/orders', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/orders', "allOrders"]);
        });

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

  public getUsers(): Promise<User[]> {
    //this.test();
    let users: User[] = [];
    let query = this.afs.firestore.collection('users');

    return query.get().then(querySnapshot => {
      querySnapshot.forEach(function (doc) {
        let user: User = new User(doc.data()['email'], doc.data()['password']);
        user.id = doc.data()['user_id'];
        user.store_id = doc.data()['store_id'];
        user.admin = doc.data()['admin'];
        users.push(user);
      })
      
      return users;
    });
  }

  /*
  dashboardType(storeId): Observable<string> {
    let query = this.afs.collection('stores');
    let dashboardType = "national";
    var subject = new Subject<string>();

    query.snapshotChanges().subscribe(actions => {
      actions.map(a => {
        if (a.payload.doc.ref.id == storeId) {
          if (a.payload.doc.data()['name'] !== null) {
            dashboardType = "magasin";
            subject.next(dashboardType);
          }
        }
      });
    });

    return subject.asObservable();
  }
  */

  
 dashboardType(storeId): Observable<string> {
  let query = this.afs.collection('stores');
  let obsNat = Observable.create(observer => {
    observer.next("national");
  });
  let obsMag = Observable.create(observer => {
    observer.next("magasin");
  });

  //console.log(obsNat)
  //console.log(obsMag)
  
  query.snapshotChanges().subscribe(actions => {
    actions.map(a => {
      if (a.payload.doc.ref.id == storeId) {
        if (a.payload.doc.data()['name'] !== null) {
          
          return obsMag;
          //subject.next(dashboardType);
          //console.log(dashboardType);
        }
      }
    });
  });  

  //return subject.asObservable();
  return obsNat;
}

  private test() {
    let storeId;
      let query = this.afs.collection('stores');

      query.snapshotChanges().subscribe(actions => {
        actions.map(a => {
          console.log(a.payload.doc.ref.id);
          const userId = a.payload.doc.data()['user_id'];
          console.log("userId = ", userId);
          if (userId == "QU0ewMDQV8ee0Oj70mF3E6yY7iy2") {
            storeId = a.payload.doc.ref.id;
          }
        });
      });
  }

  deleteCurrentUser() {
    this.afAuth.currentUser.then(user => {
      user.delete();
      this.deleteCurrentUserFromFirestore();
      this.logout();
    })
  }

  updateUser(user) {
    alert("updating"+user);
    
  }

  private deleteCurrentUserFromFirestore() {
    let currentUserId = localStorage.getItem("currentUserId");
    var query = this.afs.firestore.collection('users').where('user_id','==', currentUserId);
    var storeQuery = this.afs.firestore.collection('stores').where('user_id','==', currentUserId);

    query.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });

    storeQuery.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  updateUserRole(_id: string, _value: boolean) {
    let query = this.afs.firestore.collection('users');

    query.get().then(querySnapshot => {
      querySnapshot.forEach(function (doc) {
        if (doc.data()['user_id'] == _id)
          doc.ref.set({ admin: _value, email: doc.data()['email'], user_id: doc.data()['user_id'], store_id: doc.data()['store_id']});
    })});
  }

  updatePwd(newPwd: string, currPassword: string) {
    const currentUser = auth().currentUser;
    const credentials = auth.EmailAuthProvider.credential(currentUser.email, currPassword);

    currentUser.reauthenticateWithCredential(credentials).then(res => {
      currentUser.updatePassword(newPwd).then(res => {
        this.notifyService.showSuccess("Votre mot de passe a été changé avec succès!", "Changement mot de passe");
      }).catch(error => {
        this.notifyService.showError("Une erreur est survenue lors de la modification de votre mot de passe!", "Erreure");
      });
    }).catch(error => {
      this.notifyService.showError("Le mot de passe actuel n'est pas accepté!", "Erreure");
    });
  }
}
