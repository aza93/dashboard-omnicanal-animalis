import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { User } from 'src/shared/models/user';
import { AuthenticationService } from 'src/shared/services/authentication.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserEditorComponent } from './user-editor/user-editor.component';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SingleUserEditorComponent } from './single-user-editor/single-user-editor.component';

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
  tabs: Array<any> = [{ name: 'Modifier mon mot de passe' }, ];
  currentUser: User;
  dataSource = new MatTableDataSource<User>([]);
  isCurrentUserAdmin: boolean = false;
  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  hidePassword3: boolean = true;

  displayedColumns = ['id', 'email', 'admin', 'actions'];

  constructor(
    public authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      //this.isCurrentUserAdmin = x.admin;
    });
    this.authenticationService.getUsers().then((res: User[]) => {
      this.dataSource.data = res;
    });
    //console.log(this.users);
  }

  ngOnInit(): void {
    this.curTab = localStorage.getItem('userTabLocation');
    this.isCurrentUserAdmin = localStorage.getItem('isThisUserAdmin') === "true" ? true : false;

    this.form = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      passwordChecker: ['', [Validators.required]],
    }, { validator: this.passwordMatcher });

    if (this.isCurrentUserAdmin)
      this.tabs.push({ name: 'Gestion utilisateurs' });
    
    this.tabs.push({ name: 'Paramètres avancés' });
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

  onChangeSlideToggle(event, userId) {
    //console.log(userId);
    this.authenticationService.updateUserRole(userId, event.checked);
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

  openEditor(user) {
    this.dialog.open(UserEditorComponent, {
      data: user,
    });
  }

  openSingleUserEditor(user) {
    this.dialog.open(SingleUserEditorComponent, {
      data: user,
    });
  }

  confirmDeleteMessage(): any {
    const message = `Attention, cette action est irréversible! Êtes-vous sûr de vouloir continuer?`;

    const dialogData = new ConfirmDialogModel("Confirmation", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    return dialogRef;
  }

  deleteUser() {
    const message = 'Attention, cette action est irréversible! Êtes-vous sûr de vouloir continuer?';

    const dialogData = new ConfirmDialogModel("Confirmation", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult)
        this.authenticationService.deleteCurrentUser();
    });      
  }

  onEdit(user) {
    this.openSingleUserEditor(user);
  }

  updateUser() {
    let currentPassword = this.form.get('currentPassword').value;
    let newPassword = this.form.get('newPassword').value;
    
    this.authenticationService.updatePwd(newPassword, currentPassword);
  }
}
