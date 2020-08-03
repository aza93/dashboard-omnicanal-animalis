import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/shared/services/authentication.service';
import { User } from 'src/shared/models/user';

import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  isMobile: boolean;
  mob: boolean;
  deviceInfo = null;

  constructor(public authenticationService: AuthenticationService, private deviceService: DeviceDetectorService) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x}
      );
    
    this.epicFunction();
    this.mob = this.deviceService.isMobile();
    //this.isMobile = this.deviceService.isMobile();

    //console.log("getDeviceInfo = ", this.deviceService.getDeviceInfo());
  }

  epicFunction() {
    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log("isMobile: ", isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log("isTablet: ", isTablet);  // returns if the device us a tablet (iPad etc)
    console.log("isDesktopDevice: ", isDesktopDevice); // returns if the app is running on a Desktop browser.
  }

  ngOnInit() {
    
  }

  logout() {
    this.authenticationService.logout();
  }
}
