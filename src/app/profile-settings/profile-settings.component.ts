import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { User } from 'src/shared/models/user';
import { AuthenticationService } from 'src/shared/services/authentication.service';

import { MatDialog } from '@angular/material/dialog';
import { UserEditorComponent } from './user-editor/user-editor.component';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  @ViewChild("main") main: ElementRef;
  form: FormGroup;
  curTab: any = 0;
  selectedTabIndex: number = 0;
  tabs: Array<any> = [{ name: 'Modifier mon profile' }];
  currentUser: User;
  users: User[];
  isCurrentUserAdmin: boolean = false;

  displayedColumns = ['id', 'email', 'admin'];

  constructor(
    public authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      //this.isCurrentUserAdmin = x.admin;
    });
    this.users = this.authenticationService.getUsers();
    //console.log(this.users);
  }

  ngOnInit(): void {
    this.curTab = localStorage.getItem('userTabLocation');
    this.isCurrentUserAdmin = localStorage.getItem('isThisUserAdmin') === "true" ? true : false;

    this.form = this.formBuilder.group({
      newEmail: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      passwordChecker: ['', [Validators.required]],
    }, { validator: this.passwordMatcher });

    if (this.isCurrentUserAdmin)
      this.tabs.push({ name: 'Gestion utilisateurs' });
  }
  

  passwordMatcher(form: FormGroup) {
    let pass = form.get('newPassword').value;
    let passwordChecker = form.get('passwordChecker').value;
    return pass === passwordChecker ? null : { notSame: true }
  }

  currTab(event) {
    this.curTab = event.index;
    localStorage.setItem('userTabLocation', this.curTab);
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
    });
  }
  

  onEdit(video) {
    this.openEditor(video);
  }

  onDelete(song) {
    //this.songs = _.reject(this.songs, (item) => { return item.id === song.id; });
  }

  updateUser() {
    let newEmail = this.form.get('newEmail').value;
    let currentPassword = this.form.get('currentPassword').value;
    let newPassword = this.form.get('newPassword').value;
    
    this.authenticationService.updateUser(currentPassword, new User(newEmail, newPassword));
  }
}
