import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  @ViewChild("main") main: ElementRef;
  curTab: any = 0;
  tabs: Array<any> = [{ name: 'Modifier mon profile' }, { name: 'Gestion utilisateurs' }];

  constructor() { }

  ngOnInit(): void {
  }

  currTab(event) {
    this.curTab = event.index;
  }
}
