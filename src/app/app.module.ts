import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestInterceptor } from 'src/shared/helpers/request.interceptor';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCommonModule, MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ChartsModule } from 'ng2-charts';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { SafePipeModule } from 'safe-pipe';
import { AgGridModule } from 'ag-grid-angular';
//import 'ag-grid-enterprise';

import { OrdersToPrepareComponent } from './orders/orders-to-prepare/orders-to-prepare.component';
import { OrdersDelayedComponent } from './orders/orders-delayed/orders-delayed.component';
import { LoginComponent } from './login/login.component';
import { FilePreviewModalComponent } from './file-preview-modal/file-preview-modal.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { NumberValidatorDirective } from '../shared/directives/number-validator.directive';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ReceptionComponent } from './reception/reception.component';
import { OrderAvMoreFourteenDdComponent } from './orders/order-av-more-fourteen-dd/order-av-more-fourteen-dd.component';
import { OrdersAvLessFourteenDdComponent } from './orders/orders-av-less-fourteen-dd/orders-av-less-fourteen-dd.component';
import { OrdersShippingComponent } from './orders/orders-shipping/orders-shipping.component';
import { OrdersInProgressComponent } from './orders/orders-in-progress/orders-in-progress.component';

import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

/* Firebase services + enviorment module */
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from 'src/environments/environment';

import { AngularFirestore } from '@angular/fire/firestore';

import { ToastrModule } from 'ngx-toastr';

import {
  SessionExpirationAlert,
  SessionInteruptService
} from 'session-expiration-alert';

import { AppSessionInteruptService } from 'src/shared/services/app-session-interupt.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    RegisterComponent,
    OrdersToPrepareComponent,
    LeftMenuComponent,
    LoginComponent,
    FilePreviewModalComponent,
    NumberValidatorDirective,
    BreadcrumbComponent,
    ReceptionComponent,
    OrdersDelayedComponent,
    OrderAvMoreFourteenDdComponent,
    OrdersAvLessFourteenDdComponent,
    OrdersShippingComponent,
    OrdersInProgressComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    ChartsModule,
    MatTreeModule,
    MatIconModule,
    SafePipeModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCardModule,
    MatRadioModule,
    MatProgressBarModule,
    MatSnackBarModule,
    ScrollingModule,
    ExperimentalScrollingModule,
    AgGridModule.withComponents([]),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ToastrModule.forRoot(),
    SessionExpirationAlert.forRoot({ totalMinutes: 60 })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    MatDatepickerModule,
    DatePipe,
    AngularFirestore,
    {
      provide: SessionInteruptService,
      useClass: AppSessionInteruptService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
