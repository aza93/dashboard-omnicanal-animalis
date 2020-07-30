import { Component } from '@angular/core';
import { AuthenticationService } from 'src/shared/services/authentication.service';
import { User } from 'src/shared/models/user';

import { SessionTimerService } from 'session-expiration-alert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'homepage';
  alertAt = 30;
  startTimer = true;
  
  currentUser: User;

  sidenavWidth = 6;
  ngStyle: string;

  constructor(
    private authenticationService: AuthenticationService,
    public sessionTimer: SessionTimerService
  ) {
    this.authenticationService.loginMagento();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  increase() {
    this.sidenavWidth = 45;
    //console.log('increase sidenav width');
  }
  decrease() {
    this.sidenavWidth = 6;
    //console.log('decrease sidenav width');
  }
  
  increaseTimer() {
    this.alertAt++;
  }

  toggletimer() {
    this.startTimer = !this.startTimer;
  }
}
