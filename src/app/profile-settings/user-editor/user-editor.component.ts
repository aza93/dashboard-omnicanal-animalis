import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  //categories = CATEGORIES;

  constructor(@Inject(MAT_DIALOG_DATA) private video: any) {
  }

  onSubmit(song) {
  }

  addCast() {
    //this.song.abridged_cast.push({name: ''});
  }

  ngOnInit() {
  }
}