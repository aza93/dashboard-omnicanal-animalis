import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/shared/services/authentication.service';
import { User } from 'src/shared/models/user';
import { OrdersService } from 'src/shared/services/orders.service';
import { NotificationService } from 'src/shared/services/notification.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() changeToLoginComponent = new EventEmitter();
  email: string;
  password: string;
  passwordChecker: string;
  form: FormGroup;
  loading: Boolean = false;
  alertMsg: any = "";
  isAlerting: Boolean = false;

  dashboard: string = "national";
  dashboardMag: Boolean = false;
  stores = [
    {
        name: 'magasin A'
    },
  ];
  store: string = this.stores[0].name;

  constructor(
    private ordersService: OrdersService,
    private formBuilder: FormBuilder,
    private router: Router,
    //public userService: UserService,
    private notifyService : NotificationService,
    public authenticationService: AuthenticationService) {
  }

  loadAllOrdersStores() {
    this.stores = this.ordersService.getOrdersStores();
  }

  ngOnInit(): void {
    this.loadAllOrdersStores();

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordChecker: ['', [Validators.required]],
      dashboard: ['', [Validators.required]],
      store: ['', this.dashboard === "magasin" ? [Validators.required] : null],
    }, { validator: this.passwordMatcher });
  }

  changeDashboardType(event): void {
    this.dashboard = event.value;
    this.dashboardMag = this.dashboard === "magasin" ? true : false;
    //console.log(this.dashboard);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.resetAlert();
    const user = new User(this.form.value.email, this.form.value.password);
    user.store = this.dashboardMag ? this.form.value.store : null;
    user.admin = false;
    //console.log(user);
    this.authenticationService.register(user)
    .then(res => {
      this.changeToLoginComponent.emit();
    })
    .catch(err => {
      this.notifyService.showError(err.message, "Something is wrong");
      //console.log('Something is wrong:',err.message);
    });
  }

  alert(error) {
    this.alertMsg = error;
    this.isAlerting = true;
  }

  resetAlert() {
    this.alertMsg = "";
    this.isAlerting = false;
  }

  passwordMatcher(form: FormGroup) {
    let pass = form.get('password').value;
    let passwordChecker = form.get('passwordChecker').value;
    return pass === passwordChecker ? null : { notSame: true }
  }
}

