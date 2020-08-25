import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserEditorComponent } from './single-user-editor.component';

describe('SingleUserEditorComponent', () => {
  let component: SingleUserEditorComponent;
  let fixture: ComponentFixture<SingleUserEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleUserEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleUserEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
