import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { OrdersService } from 'src/shared/services/orders.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/shared/services/authentication.service';
import { NotificationService } from 'src/shared/services/notification.service';
import { User } from 'src/shared/models/user';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  //categories = CATEGORIES;

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
  admin: boolean = false;

  loadAllOrdersStores() {
    this.stores = this.ordersService.getOrdersStores();
  }

  onChangeSlideToggle(event) {
    this.admin = event.checked;
  }

  constructor(
    private dialogRef: MatDialogRef<UserEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private video: any,
    private ordersService: OrdersService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    public authenticationService: AuthenticationService
  ) {

  }

  onSubmit(song) {
  }

  addCast() {
    //this.song.abridged_cast.push({name: ''});
  }

  ngOnInit() {
    this.loadAllOrdersStores();

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordChecker: ['', [Validators.required]],
      dashboard: ['', [Validators.required]],
      store: ['', this.dashboard === "magasin" ? [Validators.required] : null],
    }, { validator: this.passwordMatcher });
  }

  passwordMatcher(form: FormGroup) {
    let pass = form.get('password').value;
    let passwordChecker = form.get('passwordChecker').value;
    return pass === passwordChecker ? null : { notSame: true }
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
    user.admin = this.admin;
    user.store = this.dashboardMag ? this.form.value.store : null;
    //console.log(user);
    this.authenticationService.register(user)
    .then(res => {
      this.closeDialog();
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

  closeDialog() {
    this.dialogRef.close();
  }
}