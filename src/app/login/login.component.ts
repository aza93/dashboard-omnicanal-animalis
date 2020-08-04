import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/shared/services/authentication.service';
import { first } from 'rxjs/operators';
import { User } from 'src/shared/models/user'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() changeToRegisterComponent = new EventEmitter();
  email: string;
  password: string;
  form: FormGroup;
  loading: Boolean = false;
  alertMsg: any = "";
  hidePassword: boolean = true;
  isAlerting: Boolean = false;

  constructor(private formBuilder: FormBuilder, public authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() { 
    if (this.form.invalid) return;   
    this.loading=true;
    this.resetAlert();
    this.authenticationService.login(new User(this.form.value.email, this.form.value.password));
    //this.authenticationService.loginMagento();
  }

  alert(error){
    this.alertMsg = error;
    this.isAlerting = true;
  }

  resetAlert(){
    this.alertMsg = "";
    this.isAlerting = false;
  }
}
