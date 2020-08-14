import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { User } from 'src/shared/models/user';
import { AuthenticationService } from 'src/shared/services/authentication.service';

import { MatDialog } from '@angular/material/dialog';
import { UserEditorComponent } from './user-editor/user-editor.component';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  @ViewChild("main") main: ElementRef;
  curTab: any = 0;
  tabs: Array<any> = [{ name: 'Modifier mon profile' }, { name: 'Gestion utilisateurs' }];
  currentUser: User;
  users: User[];

  displayedColumns = ['id', 'email', 'admin'];

  constructor(
    public authenticationService: AuthenticationService,
    private dialog: MatDialog
    ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
    this.users = this.authenticationService.getUsers();
    console.log(this.users);
  }

  ngOnInit(): void {
  }

  currTab(event) {
    this.curTab = event.index;
  }

  onNew() {
    const video = {
      'id': '',
      'title': '',
      'categories': [],
      'thumbnails': {
        '400x207': '',
        '293x293': '',
        '295x144': '',
        '640x333': '',
        '341x307': ''
      },
      'synopsis': '',
      'abridged_cast': [{
        'name': ''
      }],
      'links': {
        'download': ''
      }
    };
    this.openEditor(video);
  }

  openEditor(video) {
    this.dialog.open(UserEditorComponent, {
      data: video,
      height: '80vh',
      width: '70vw',
    });
  }
  

  onEdit(video) {
    this.openEditor(video);
  }

  onDelete(song) {
    //this.songs = _.reject(this.songs, (item) => { return item.id === song.id; });
  }
}
