import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

import { Order } from 'src/shared/models/Order';
import { DelayedOrder } from 'src/shared/models/DelayedOrder';
import { OrderAvMore14dd } from 'src/shared/models/OrderAvMore14dd';


@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public ordersUrl = `${environment.apiUrlMagento}/rest/V1/orders`;
  private currentUserToken: string;
  private now = Date.now();

  private dataSentSubject = new Subject<string>();
  public getDataSentEvent = this.dataSentSubject.asObservable();
  
  private httpOptions = {
    //withCredentials: true
     headers: new HttpHeaders({
       "Access-Control-Allow-Origin": "*",
       'Access-Control-Allow-Method': 'GET, POST, OPTIONS, DELETE',
       "Access-Control-Allow-Credentials": "true",
       "Access-Control-Allow-Headers": "Origin, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, Authorization",
       'Content-Type': 'application/json',
       'Authorization':'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token
     })
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {  }

  getOrders(): Observable<Order[]> {
    return this.http.get<any>(this.ordersUrl+"?searchCriteria[pageSize]=10", this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: Order[] = [];
            let ord: Order;

            for (let r of res.items) {
              ord = new Order();

              ord.magasin = r.billing_address.city;
              ord.date_creation = r.created_at;
              ord.type_commande = r.shipping_description;
              ord.numero_commande = r.increment_id;
              ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
              ord.tel = r.billing_address.telephone;
              ord.nb_produits = r.items.length;
              
              newOrders.push(ord);
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrders', []))
      )
  }

  getDelayedOrders(): Observable<DelayedOrder[]> {
    return this.http.get<any>(this.ordersUrl+"?searchCriteria[pageSize]=5", this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: DelayedOrder[] = [];
            let ord: DelayedOrder;

            for (let r of res.items) {
              ord = new DelayedOrder();

              let date1 = new Date(this.now).getTime();
              let date2 = new Date(r.created_at).getTime();
              let time = date1 - date2;  //msec
              let hoursDiff = time / (3600 * 1000);

              ord.magasin = r.billing_address.city;
              ord.date_creation = r.created_at;
              ord.type_commande = r.shipping_description;
              ord.numero_commande = r.increment_id;
              ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
              ord.tel = r.billing_address.telephone;
              ord.nb_produits = r.items.length;
              ord.retard = Math.floor(hoursDiff);
              
              newOrders.push(ord);
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getDelayedOrders', []))
      )
  }
  
  getOrdersAvMore14dd(): Observable<OrderAvMore14dd[]> {
    return this.http.get<any>(this.ordersUrl+"?searchCriteria[pageSize]=5", this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderAvMore14dd[] = [];
            let ord: OrderAvMore14dd;

            for (let r of res.items) {
              ord = new OrderAvMore14dd();

              let date1 = new Date(this.now).getTime();
              let date2 = new Date(r.created_at).getTime();
              let time = date1 - date2;  //msec
              let daysDiff = time / (1000*60*60*24);

              ord.magasin = r.billing_address.city;
              ord.date_creation = r.created_at;
              //if (arr.length - 1 === i)
              //r.status_histories.map((item)=> ord.date_mise_de_cote = item.created_at);
              //(map) => Array.from(map)[map.size-1];
              ord.date_mise_de_cote = Array.from(r.status_histories.values()).pop()['created_at'];
              ord.dispo_depuis = Math.floor(daysDiff);
              ord.type_commande = r.shipping_description;
              ord.numero_commande = r.increment_id;
              ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
              ord.tel = r.billing_address.telephone;
              
              newOrders.push(ord);
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getDelayedOrders', []))
      )
  }

  alertDataSent() {
    this.dataSentSubject.next();
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ListeService message with the MessageService */
  private log(message: string) {

  }
}
