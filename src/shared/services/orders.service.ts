import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

import { OrdersStore } from 'src/shared/models/OrdersStore';
import { OrderAllFields } from 'src/shared/models/OrderAllFields';
import { Order } from 'src/shared/models/Order';
import { DelayedOrder } from 'src/shared/models/DelayedOrder';
import { OrderAvMore14dd } from 'src/shared/models/OrderAvMore14dd';
import { OrderAvLess14dd } from 'src/shared/models/OrderAvLess14dd';
import { OrderShipping } from 'src/shared/models/OrderShipping';
import { OrderInProgress } from 'src/shared/models/OrderInProgress';

import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public ordersUrl = `${environment.apiUrlMagento}/rest/V1/orders`;
  private currentUserToken: string;
  private now = Date.now();

  private dataSentSubject = new Subject<string>();
  public getDataSentEvent = this.dataSentSubject.asObservable();
  private storeLoc;
  
  private httpOptions = {
    //withCredentials: true
     headers: new HttpHeaders({
       "Access-Control-Allow-Origin": "*",
       'Access-Control-Allow-Method': 'GET, POST, OPTIONS, DELETE',
       "Access-Control-Allow-Credentials": "true",
       "Access-Control-Allow-Headers": "Origin, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, Authorization, cookie",
       'Content-Type': 'application/json',
       'Authorization':'Bearer ' + localStorage.getItem('magentoAdminToken'),
       //'Set-Cookie': 'cross-site-cookie=name; SameSite=None; Secure',
     })
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar, public datePipe: DatePipe = new DatePipe("fr-FR")) { }

  getOrdersStores(): OrdersStore[] {
     let orderStores: OrdersStore[] = environment.amstyStoreLocator;
     
     return orderStores;
  }

  private transformDateIos(date: string): string {
    return date.replace(/\s/, 'T');
  }

  private getPassedMsec(date): number {
    let date1: Date = new Date(this.now);
    let date2: Date = new Date(date);

    this.add2Hours(date2);

    return date1.getTime() - date2.getTime();
  }

  private concatDateTimeFr(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') + ' à ' + this.datePipe.transform(date, 'HH:mm:ss');
  }

  getAllOrders(): Observable<OrderAllFields[]> {
   return this.http.get<any>(`${this.ordersUrl}/getAllOrders`, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderAllFields[] = [];
            let ord: OrderAllFields;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res) {
              ord = new OrderAllFields();

              // ID
              ord.id = r.order_increment_id;
              // Magasin
              ord.magasin = r.store;
              // Date de la commande
              let orderDateIos = new Date(this.transformDateIos(r.created_at));
              ord.date_creation = this.concatDateTimeFr(orderDateIos);
              // Date mise de côté
              if (r.date_mise_de_cote !== "") {
                let dateMiseCoteIos = new Date(this.transformDateIos(r.date_mise_de_cote));
                ord.date_mise_de_cote = this.concatDateTimeFr(dateMiseCoteIos);
              }
              // Date d'expédition
              let shippingDateIos = new Date(this.transformDateIos(r.shipping_date));
              ord.date_exp = this.concatDateTimeFr(shippingDateIos);
              // Type de commande
              ord.type_commande = r.order_type;
              // Numéro de commande
              ord.numero_commande = r.order_cylande_code;
              // Nom client
              ord.nom_client = r.customer_name;
              // Téléphone
              ord.tel = r.customer_phone;
              // Nb produits
              ord.nb_produits = r.products_number;
              // Commande dispo depuis (fromatted)
              ord.dispo_depuis = r.available_for;

              if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                newOrders.push(ord);
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getAllOrders', []))
      )
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<any>(`${this.ordersUrl}/getOrdersToPrepare`, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: Order[] = [];
            let ord: Order;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res) {
              ord = new Order();

              let orderDateIos = new Date(this.transformDateIos(r.created_at));
              ord.id = r.order_increment_id;
              ord.magasin = r.store;
              ord.date_creation = this.concatDateTimeFr(orderDateIos);
              ord.type_commande = r.order_type;
              ord.numero_commande = r.order_cylande_code;
              ord.nom_client = r.customer_name;
              ord.tel = r.customer_phone;
              ord.nb_produits = r.products_number;
              ord.dispo_depuis = r.available_for;

              if ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null")) {  
                newOrders.push(ord);
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrders', []))
      )
  }

  getDelayedOrders(): Observable<DelayedOrder[]> {

    return this.http.get<any>(`${this.ordersUrl}/getDelayedOrders`, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: DelayedOrder[] = [];
            let ord: DelayedOrder;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res) {

              ord = new DelayedOrder();
              
              let orderDateIos = new Date(this.transformDateIos(r.created_at));

              ord.id = r.order_increment_id;
              ord.magasin = r.store;
              ord.date_creation = this.concatDateTimeFr(orderDateIos);
              ord.type_commande = r.order_type;
              ord.numero_commande = r.order_cylande_code;
              ord.nom_client = r.customer_name;
              ord.tel = r.customer_phone;
              ord.nb_produits = r.products_number;
              ord.dispo_depuis = r.available_for;

              
              if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                newOrders.push(ord);
              }
            }

            //console.log("newOrders (SERVICE): ", newOrders);
            return newOrders;
        }),
        catchError(this.handleError('getDelayedOrders', []))
      )
  }

  getOrdersAvMore14dd(): Observable<OrderAvMore14dd[]> {
    return this.http.get<any>(`${this.ordersUrl}/getOrdersAvMore14dd`, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderAvMore14dd[] = [];
            let ord: OrderAvMore14dd;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res) {
              ord = new OrderAvMore14dd();
              
              ord.id = r.order_increment_id;
              ord.magasin = r.store;
              
              let orderDateIos = new Date(this.transformDateIos(r.created_at));
              ord.date_creation = this.concatDateTimeFr(orderDateIos);

              if (r.date_mise_de_cote !== null) {
                let dateMiseCoteIos = new Date(this.transformDateIos(r.date_mise_de_cote));
                ord.date_mise_de_cote = this.concatDateTimeFr(dateMiseCoteIos);
              }

              ord.dispo_depuis = r.available_for;
              ord.type_commande = r.order_type;
              ord.numero_commande = r.order_cylande_code;
              ord.nom_client = r.customer_name;
              ord.tel = r.customer_phone;
              ord.nb_produits = r.products_number;
                    

              if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                newOrders.push(ord);
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrdersAvMore14dd', []))
      )
  }

  /*

  fields=items[status,increment_id,items[amount_refunded],extension_attributes[cylande_code,shipping_assignments[shipping[address[company]]]],created_at,shipping_description,customer_firstname,customer_lastname,billing_address[telephone],status_histories]&

  */

  getOrdersAvLess14dd(): Observable<OrderAvMore14dd[]> {
    return this.http.get<any>(`${this.ordersUrl}/getOrdersAvLess14dd`, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderAvLess14dd[] = [];
            let ord: OrderAvLess14dd;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res) {
              ord = new OrderAvLess14dd();
              
              ord.id = r.order_increment_id;
              ord.magasin = r.store;
              
              let orderDateIos = new Date(this.transformDateIos(r.created_at));
              ord.date_creation = this.concatDateTimeFr(orderDateIos);

              if (r.date_mise_de_cote !== null) {
                let dateMiseCoteIos = new Date(this.transformDateIos(r.date_mise_de_cote));
                ord.date_mise_de_cote = this.concatDateTimeFr(dateMiseCoteIos);
              }

              ord.dispo_depuis = r.available_for;
              ord.type_commande = r.order_type;
              ord.numero_commande = r.order_cylande_code;
              ord.nom_client = r.customer_name;
              ord.tel = r.customer_phone;
              ord.nb_produits = r.products_number;
                    

              if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                newOrders.push(ord);
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrdersAvLess14dd', []))
      )
  }

  getOrdersShipping(): Observable<OrderShipping[]> {
    return this.http.get<any>(`${this.ordersUrl}/getOrdersShipping`, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderShipping[] = [];
            let ord: OrderShipping;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res) {
              ord = new OrderShipping();
              
              let orderDateIos = new Date(this.transformDateIos(r.created_at));
              let shippingDateIos = new Date(this.transformDateIos(r.shipping_date));

              ord.id = r.order_increment_id;
              ord.magasin = r.store;
              ord.date_commande = this.concatDateTimeFr(orderDateIos);
              ord.date_expedition = this.concatDateTimeFr(shippingDateIos);
              ord.type_commande = r.order_type;
              ord.numero_commande = r.order_cylande_code;
              ord.nom_client = r.customer_name;
              ord.tel = r.customer_phone;
              ord.nb_produits = r.products_number;

              if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                newOrders.push(ord);
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrdersShipping', []))
      )
  }
  
  getOrdersInProgress(): Observable<OrderInProgress[]> {
    return this.http.get<any>(`${this.ordersUrl}/getOrdersInProgress`, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderInProgress[] = [];
            let ord: OrderInProgress;
            this.storeLoc = localStorage.getItem("store");
            for (let r of res) {
              ord = new OrderInProgress();
              
              let orderDateIos = new Date(this.transformDateIos(r.created_at));

              ord.id = r.order_increment_id;
              ord.magasin = r.store;
              ord.date_commande = this.concatDateTimeFr(orderDateIos);
              ord.type_commande = r.order_type;
              ord.numero_commande = r.order_cylande_code;
              ord.nom_client = r.customer_name;
              ord.tel = r.customer_phone;
              ord.nb_produits = r.products_number;

              if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                newOrders.push(ord);
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrdersInProgress', []))
      )
  }

  getOrderInfo(cylandeCode): Observable<Order[]> {
    return this.http.get<any>(`${this.ordersUrl}?
                               searchCriteria[filterGroups][0][filters][extension_attributes][field]=cylande_code&
                               searchCriteria[filterGroups][0][filters][extension_attributes][value]=${cylandeCode}&
                               searchCriteria[filterGroups][0][filters][extension_attributes][conditionType]=eq&
                               searchCriteria[pageSize]=${parseInt(localStorage.getItem("pageSize"))}
                               `, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: Order[] = [];
            let ord: Order;
            for (let r of res.items) {
              ord = new Order();

              let orderDateIos = new Date(this.transformDateIos(r.created_at));
              this.add2Hours(orderDateIos);
              ord.id = r.increment_id;
              ord.magasin = r.extension_attributes.shipping_assignments[0].shipping.address.company;
              //ord.date_commande = this.datePipe.transform(orderDateIos, 'dd/MM/yyyy') + ' à ' + this.datePipe.transform(orderDateIos, 'HH:mm:ss');
              ord.type_commande = r.shipping_description;
              ord.numero_commande = r.extension_attributes.cylande_code;
              ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
              ord.tel = r.billing_address.telephone;
              ord.nb_produits = r.items.length;

              newOrders.push(ord);
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrdersInProgress', []))
      )
  }

  alertDataSent() {
    this.dataSentSubject.next();
  }

  private add2Hours(date: Date) {
    date.setHours(date.getHours() + 2);
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
