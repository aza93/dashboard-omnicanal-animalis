import { Injectable } from '@angular/core';
import { SessionInteruptService } from 'session-expiration-alert';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from 'src/shared/services/authentication.service';

@Injectable()
export class AppSessionInteruptService extends SessionInteruptService {
  constructor(private readonly httpClient: HttpClient, private authenticationService: AuthenticationService) {
    super();
  }
  continueSession() {
    console.log(`I issue an API request to server.`);
  }
  stopSession() {
    console.log(`I logout.`);
    this.authenticationService.logout();
  }
}
