import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersToPrepareComponent } from './orders-to-prepare.component';

describe('OrdersToPrepareComponent', () => {
  let component: OrdersToPrepareComponent;
  let fixture: ComponentFixture<OrdersToPrepareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersToPrepareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersToPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
