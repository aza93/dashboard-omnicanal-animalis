import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from 'src/shared/helpers/auth.guard'
import { ReceptionComponent } from './reception/reception.component';

import { OrdersComponent } from './orders/orders.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';

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
    path: "orders/:orderType",
    component: OrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "profile",
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard]
  },

  // otherwise redirect to home
  {
    path: '**',
    redirectTo: 'home'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
