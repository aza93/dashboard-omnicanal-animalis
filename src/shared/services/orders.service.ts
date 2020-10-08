import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

import { OrdersStore } from 'src/shared/models/OrdersStore';
import { Order } from 'src/shared/models/Order';
import { DelayedOrder } from 'src/shared/models/DelayedOrder';
import { OrderAvMore14dd } from 'src/shared/models/OrderAvMore14dd';
import { OrderAvLess14dd } from 'src/shared/models/OrderAvLess14dd';
import { OrderShipping } from 'src/shared/models/OrderShipping';
import { OrderInProgress } from 'src/shared/models/OrderInProgress';

import { DatePipe } from '@angular/common'


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
    /*
    return this.http.get<any>(`${this.ordersUrl}?
                               searchCriteria[filterGroups][0][filters][0][field]=state&
                               searchCriteria[filterGroups][0][filters][0][value]=processing&
                               searchCriteria[filterGroups][0][filters][0][conditionType]=eq&
                               searchCriteria[filterGroups][1][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][1][filters][0][value]=%Click %26 Collect%&
                               searchCriteria[filterGroups][1][filters][0][conditionType]=like&
                               searchCriteria[filterGroups][2][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][2][filters][0][value]=%Retrait sous 2h%&
                               searchCriteria[filterGroups][2][filters][0][conditionType]=like&
                               fields=items[extension_attributes,extension_attributes,items,created_at,shipping_description,increment_id,customer_firstname,customer_lastname,billing_address[city,telephone]]&
                               searchCriteria[pageSize]=${parseInt(localStorage.getItem("pageSize"))}
                               `, this.httpOptions)
      .pipe(
        map(res => {
            let orderStores: OrdersStore[] = [];
            let orderStore: OrdersStore;
            //console.log(res);
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res.items) {
                orderStore = new OrdersStore();

                orderStore.name = r.extension_attributes.shipping_assignments[0].shipping.address.company;
                
                orderStores.push(orderStore);
            }
            
            return orderStores;
        }),
        catchError(this.handleError('getOrdersStore', []))
      )
      */
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

  getOrders(): Observable<Order[]> {
    
    return this.http.get<any>(`${this.ordersUrl}?
                               searchCriteria[filterGroups][0][filters][0][field]=state&
                               searchCriteria[filterGroups][0][filters][0][value]=processing&
                               searchCriteria[filterGroups][0][filters][0][conditionType]=eq&
                               searchCriteria[filterGroups][1][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][1][filters][0][value]=%Click %26 Collect%&
                               searchCriteria[filterGroups][1][filters][0][conditionType]=like&
                               searchCriteria[filterGroups][2][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][2][filters][0][value]=%Retrait sous 2h%&
                               searchCriteria[filterGroups][2][filters][0][conditionType]=like&
                               fields=items[increment_id,items[amount_refunded],extension_attributes[cylande_code,shipping_assignments[shipping[address[company]]]],created_at,shipping_description,customer_firstname,customer_lastname,billing_address[telephone]]&
                               searchCriteria[pageSize]=${parseInt(localStorage.getItem("pageSize"))}
                               `, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: Order[] = [];
            let ord: Order;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res.items) {
              let time = this.getPassedMsec(this.transformDateIos(r.created_at));
              let hoursDiff = time / (3600 * 1000);
              
              if (hoursDiff < 2) {
                ord = new Order();
                let orderDateIos = new Date(this.transformDateIos(r.created_at));
                this.add2Hours(orderDateIos);
                ord.id = r.increment_id;
                ord.magasin = r.extension_attributes.shipping_assignments[0].shipping.address.company;
                ord.date_creation = this.concatDateTimeFr(orderDateIos);
                ord.type_commande = r.shipping_description;
                ord.numero_commande = r.extension_attributes.cylande_code;
                ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
                ord.tel = r.billing_address.telephone;
                ord.nb_produits = r.items.length;
                ord.retard = Math.floor(hoursDiff);

                if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                  newOrders.push(ord);
                }
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrders', []))
      )
  }

  getDelayedOrders(): Observable<DelayedOrder[]> {

    return this.http.get<any>(`${this.ordersUrl}?
                               searchCriteria[filterGroups][0][filters][0][field]=state&
                               searchCriteria[filterGroups][0][filters][0][value]=processing&
                               searchCriteria[filterGroups][0][filters][0][conditionType]=eq&
                               searchCriteria[filterGroups][1][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][1][filters][0][value]=%Click %26 Collect%&
                               searchCriteria[filterGroups][1][filters][0][conditionType]=like&
                               searchCriteria[filterGroups][2][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][2][filters][0][value]=%Retrait sous 2h%&
                               searchCriteria[filterGroups][2][filters][0][conditionType]=like&
                               fields=items[increment_id,items[amount_refunded],extension_attributes[cylande_code,shipping_assignments[shipping[address[company]]]],created_at,shipping_description,customer_firstname,customer_lastname,billing_address[telephone]]&
                               searchCriteria[pageSize]=${parseInt(localStorage.getItem("pageSize"))}
                               `, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: DelayedOrder[] = [];
            let ord: DelayedOrder;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res.items) {
              let time = this.getPassedMsec(this.transformDateIos(r.created_at));
              //let time = new Date(this.now).getTime() - new Date(r.created_at.replace(/\s/, 'T')).getTime();
              let hoursDiff = time / (3600 * 1000);

              if (hoursDiff > 2) {
                ord = new DelayedOrder();

                let orderDateIos = new Date(this.transformDateIos(r.created_at));
                this.add2Hours(orderDateIos);
                ord.id = r.increment_id;
                ord.magasin = r.extension_attributes.shipping_assignments[0].shipping.address.company;
                ord.date_creation = this.concatDateTimeFr(orderDateIos);
                ord.type_commande = r.shipping_description;
                ord.numero_commande = r.extension_attributes.cylande_code;
                ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
                ord.tel = r.billing_address.telephone;
                ord.nb_produits = r.items.length;
                ord.retard = Math.floor(hoursDiff);
                
                if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                  newOrders.push(ord);
                }
              }
            }

            //console.log("newOrders (SERVICE): ", newOrders);
            return newOrders;
        }),
        catchError(this.handleError('getDelayedOrders', []))
      )
  }
  
  getOrdersAvMore14dd(): Observable<OrderAvMore14dd[]> {

    return this.http.get<any>(`${this.ordersUrl}?
                               searchCriteria[filterGroups][0][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][0][filters][0][value]=%Click %26 Collect%&
                               searchCriteria[filterGroups][0][filters][0][conditionType]=like&
                               fields=items[increment_id,items[amount_refunded],extension_attributes[cylande_code,shipping_assignments[shipping[address[company]]]],created_at,shipping_description,customer_firstname,customer_lastname,billing_address[telephone],status_histories]&
                               searchCriteria[pageSize]=${parseInt(localStorage.getItem("pageSize"))}
                               `, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderAvMore14dd[] = [];
            let ord: OrderAvMore14dd;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res.items) {
              let shipDesc = r.shipping_description;
              if (r.status_histories[0]) {
                let status = r.status_histories[0].status;
                // if (r.state == "processing" || ((r.state == "complete") && (status == "complete")))
                if ((status == "complete" && shipDesc.includes("Retrait sous 2h")) ||
                (status == "package_received" && shipDesc.includes("Retrait sous 3 à 4 jours"))) {
                  let time = this.getPassedMsec(this.transformDateIos(r.created_at));
                  let daysDiff = time / (1000*60*60*24);

                  if (daysDiff > 14) {
                    ord = new OrderAvMore14dd();

                    let orderDateIos = new Date(this.transformDateIos(r.created_at));
                    this.add2Hours(orderDateIos);
                    let dateMiseCoteIos = new Date(this.transformDateIos(r.status_histories[0].created_at));
                    this.add2Hours(dateMiseCoteIos);
                    ord.id = r.increment_id;
                    ord.magasin = r.extension_attributes.shipping_assignments[0].shipping.address.company;
                    ord.date_creation = this.concatDateTimeFr(orderDateIos);
                    if (r.status_histories[0])
                      ord.date_mise_de_cote = this.concatDateTimeFr(dateMiseCoteIos);
                    ord.dispo_depuis = Math.floor(daysDiff);
                    //ord.type_commande = r.shipping_description;
                    ord.type_commande = shipDesc;
                    ord.numero_commande = r.extension_attributes.cylande_code;
                    ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
                    ord.tel = r.billing_address.telephone;
                    ord.nb_produits = r.items.length;
                    

                    if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                      newOrders.push(ord);
                    }
                  }
                }
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('getOrdersAvMore14dd', []))
      )
  }
  
  getOrdersAvLess14dd(): Observable<OrderAvLess14dd[]> {
    return this.http.get<any>(`${this.ordersUrl}?
                               searchCriteria[filterGroups][0][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][0][filters][0][value]=%Click %26 Collect%&
                               searchCriteria[filterGroups][0][filters][0][conditionType]=like&
                               fields=items[status,increment_id,items[amount_refunded],extension_attributes[cylande_code,shipping_assignments[shipping[address[company]]]],created_at,shipping_description,customer_firstname,customer_lastname,billing_address[telephone],status_histories]&
                               searchCriteria[pageSize]=${parseInt(localStorage.getItem("pageSize"))}
                               `, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderAvLess14dd[] = [];
            let ord: OrderAvLess14dd;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res.items) {
              let shipDesc = r.shipping_description;
              if (r.status_histories[0]) {
                let status = r.status_histories[0].status;
                if ((r.status == "complete" && shipDesc.includes("Retrait sous 2h")) ||
                (status == "package_received" && shipDesc.includes("Retrait sous 3 à 4 jours"))) {
                //if (r.state == "processing" || ((r.state == "complete") && (status == "complete"))) {
                  let time = this.getPassedMsec(this.transformDateIos(r.created_at));
                  let daysDiff = time / (1000*60*60*24);

                  if (daysDiff < 14) {
                    ord = new OrderAvLess14dd();

                    let orderDateIos = new Date(this.transformDateIos(r.created_at));
                    let dateMiseCoteIos = new Date(this.transformDateIos(r.status_histories[0].created_at));
                    this.add2Hours(orderDateIos);
                    this.add2Hours(dateMiseCoteIos);
                    ord.id = r.increment_id;
                    ord.magasin = r.extension_attributes.shipping_assignments[0].shipping.address.company;
                    ord.date_creation = this.concatDateTimeFr(orderDateIos);
                    if (r.status_histories[0])
                      ord.date_mise_de_cote =  this.concatDateTimeFr(dateMiseCoteIos);
                    ord.dispo_depuis = Math.floor(daysDiff);
                    //ord.type_commande = r.shipping_description;
                    ord.type_commande = shipDesc;
                    ord.numero_commande = r.extension_attributes.cylande_code;
                    ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
                    ord.tel = r.billing_address.telephone;
                    ord.nb_produits = r.items.length;

                    if ((ord.magasin != null) && ((this.storeLoc !== "null" && ord.magasin === this.storeLoc) || (this.storeLoc === "null"))) {  
                      newOrders.push(ord);
                    }
                  }
                }
              }
            }
            
            return newOrders;
        }),
        catchError(this.handleError('OrderAvLess14dd', []))
      )
  }
  
  getOrdersShipping(): Observable<OrderShipping[]> {
    return this.http.get<any>(`${this.ordersUrl}?
                               searchCriteria[filterGroups][0][filters][0][field]=state&
                               searchCriteria[filterGroups][0][filters][0][value]=complete&
                               searchCriteria[filterGroups][0][filters][0][conditionType]=eq&
                               searchCriteria[filterGroups][1][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][1][filters][0][value]=%Click %26 Collect%&
                               searchCriteria[filterGroups][1][filters][0][conditionType]=like&
                               searchCriteria[filterGroups][2][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][2][filters][0][value]=%Retrait sous 3 à 4 jours%&
                               searchCriteria[filterGroups][2][filters][0][conditionType]=like&
                               fields=items[increment_id,created_at,extension_attributes[shipping_assignments[shipping[address[company]],items[updated_at]],cylande_code],items[amount_refunded]shipping_description,customer_firstname,customer_lastname,billing_address[telephone],status_histories[created_at,status]]&
                               searchCriteria[pageSize]=${parseInt(localStorage.getItem("pageSize"))}
                               `, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderShipping[] = [];
            let ord: OrderShipping;
            let dateExp: Date;
            this.storeLoc = localStorage.getItem("store");
            
            for (let r of res.items) {
              ord = new OrderShipping();
              let items = r.extension_attributes.shipping_assignments[0].items;
              let itemsLength = r.extension_attributes.shipping_assignments[0].items.length;
              dateExp = new Date(this.transformDateIos(items[itemsLength - 1].updated_at));
              this.add2Hours(dateExp);

              let orderDateIos = new Date(this.transformDateIos(r.created_at));
              this.add2Hours(orderDateIos);
              ord.id = r.increment_id;
              ord.magasin = r.extension_attributes.shipping_assignments[0].shipping.address.company;
              ord.date_commande = this.concatDateTimeFr(orderDateIos);              
              ord.date_expedition = this.concatDateTimeFr(dateExp);
              ord.type_commande = r.shipping_description;
              ord.numero_commande = r.extension_attributes.cylande_code;
              ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
              ord.tel = r.billing_address.telephone;
              ord.nb_produits = r.items.length;

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
    return this.http.get<any>(`${this.ordersUrl}?
                               searchCriteria[filterGroups][0][filters][0][field]=state&
                               searchCriteria[filterGroups][0][filters][0][value]=processing&
                               searchCriteria[filterGroups][0][filters][0][conditionType]=eq&
                               searchCriteria[filterGroups][1][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][1][filters][0][value]=%Click %26 Collect%&
                               searchCriteria[filterGroups][1][filters][0][conditionType]=like&
                               searchCriteria[filterGroups][2][filters][0][field]=shipping_description&
                               searchCriteria[filterGroups][2][filters][0][value]=%Retrait sous 3 à 4 jours%&
                               searchCriteria[filterGroups][2][filters][0][conditionType]=like&
                               fields=items[increment_id,items[amount_refunded],extension_attributes[cylande_code,shipping_assignments[shipping[address[company]]]],created_at,shipping_description,customer_firstname,customer_lastname,billing_address[telephone]]&
                               searchCriteria[pageSize]=${parseInt(localStorage.getItem("pageSize"))}
                               `, this.httpOptions)
      .pipe(
        map(res => {
            let newOrders: OrderInProgress[] = [];
            let ord: OrderInProgress;
            this.storeLoc = localStorage.getItem("store");
            for (let r of res.items) {
              ord = new OrderInProgress();
              
              let orderDateIos = new Date(this.transformDateIos(r.created_at));
              this.add2Hours(orderDateIos);
              ord.id = r.increment_id;
              ord.magasin = r.extension_attributes.shipping_assignments[0].shipping.address.company;
              ord.date_commande = this.concatDateTimeFr(orderDateIos);
              ord.type_commande = r.shipping_description;
              ord.numero_commande = r.extension_attributes.cylande_code;
              ord.nom_client = r.customer_firstname +" "+ r.customer_lastname;
              ord.tel = r.billing_address.telephone;
              ord.nb_produits = r.items.length;

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

  private add2Hours(date: Date) {
    date.setHours(date.getHours() + 2);
  }
}
