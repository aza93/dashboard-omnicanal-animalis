import { Component } from '@angular/core';
import { AuthenticationService } from 'src/shared/services/authentication.service';
import { User } from 'src/shared/models/user';

import { SessionTimerService } from 'session-expiration-alert';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  mob: boolean;

  sidenavWidth = 6;
  ngStyle: string;

  constructor(
    private authenticationService: AuthenticationService,
    public sessionTimer: SessionTimerService,
    private deviceService: DeviceDetectorService
  ) {
    this.authenticationService.loginMagento();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.mob = this.deviceService.isMobile();
  }

  increase() {
    this.sidenavWidth = this.mob ? 6 : 45;
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
