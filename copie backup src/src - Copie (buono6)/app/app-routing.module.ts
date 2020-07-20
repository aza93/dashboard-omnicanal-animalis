import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/shared/helpers/auth.guard'
import { ReceptionComponent } from './reception/reception.component';

import { OrdersToPrepareComponent } from './orders/orders-to-prepare/orders-to-prepare.component';
import { OrdersDelayedComponent } from './orders/orders-delayed/orders-delayed.component';
import { OrderAvMoreFourteenDdComponent } from './orders/order-av-more-fourteen-dd/order-av-more-fourteen-dd.component';
import { OrdersAvLessFourteenDdComponent } from './orders/orders-av-less-fourteen-dd/orders-av-less-fourteen-dd.component';
import { OrdersShippingComponent } from './orders/orders-shipping/orders-shipping.component';
import { OrdersInProgressComponent } from './orders/orders-in-progress/orders-in-progress.component';

const routes: Routes = [
  {
    path: "",
    component: ReceptionComponent
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "ordersToPrepare",
    component: OrdersToPrepareComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "ordersDelayed",
    component: OrdersDelayedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "ordersAvMore14dd",
    component: OrderAvMoreFourteenDdComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "ordersAvLess14dd",
    component: OrdersAvLessFourteenDdComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "ordersShipping",
    component: OrdersShippingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "ordersInProgress",
    component: OrdersInProgressComponent,
    canActivate: [AuthGuard]
  },

  // otherwise redirect to home
  { path: '**', redirectTo: 'home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
