import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/shared/services/orders.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/shared/services/notification.service';
import { User } from 'src/shared/models/user';
import { AuthenticationService } from 'src/shared/services/authentication.service';

@Component({
  selector: 'app-single-user-editor',
  templateUrl: './single-user-editor.component.html',
  styleUrls: ['./single-user-editor.component.scss']
})
export class SingleUserEditorComponent implements OnInit {
  dashboard: string = "national";
  dashboardMag: Boolean = false;
  stores = [
    {
        name: 'magasin A'
    },
  ];
  store: string = this.stores[0].name;

  email: string;
  password: string;
  passwordChecker: string;
  form: FormGroup;
  isAlerting: Boolean = false;
  loading: Boolean = false;
  alertMsg: any = "";
  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  hidePassword3: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<SingleUserEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any,
    private ordersService: OrdersService,
    private formBuilder: FormBuilder,
    private notifyService : NotificationService,
    public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.loadAllOrdersStores();

    this.form = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      passwordChecker: ['', [Validators.required]],
      dashboard: ['', [Validators.required]],
      store: ['', this.dashboard === "magasin" ? [Validators.required] : null],
    }, { validator: this.passwordMatcher });
  }

  passwordMatcher(form: FormGroup) {
    let pass = form.get('newPassword').value;
    let passwordChecker = form.get('passwordChecker').value;
    return pass === passwordChecker ? null : { notSame: true }
  }

  loadAllOrdersStores() {
    this.stores = this.ordersService.getOrdersStores();
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
    //console.log(user);
    /*
    this.authenticationService.updateUser(user)
    .then(res => {
      this.closeDialog();
    })
    .catch(err => {
      this.notifyService.showError(err.message, "Something is wrong");
      //console.log('Something is wrong:',err.message);
    });
    */
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
