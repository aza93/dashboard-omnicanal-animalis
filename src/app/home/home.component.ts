import { Component, OnInit } from '@angular/core';
import { AutoLogoutService } from 'src/shared/services/auto-logout.service';
import { AuthenticationService } from 'src/shared/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AutoLogoutService]
})
export class HomeComponent implements OnInit {

  constructor(private autoLogoutService: AutoLogoutService, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
  }

  stay() {
    this.autoLogoutService.reset();
  }
}
