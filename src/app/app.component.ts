import { Component } from '@angular/core';
import { AuthenticationService } from 'src/shared/services/authentication.service';
import { User } from 'src/shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'homepage';

  currentUser: User;

  sidenavWidth = 6;
  ngStyle: string;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.loginMagento();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  increase() {
    this.sidenavWidth = 45;
    console.log('increase sidenav width');
  }
  decrease() {
    this.sidenavWidth = 6;
    console.log('decrease sidenav width');
  }
}
