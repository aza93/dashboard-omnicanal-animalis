import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDelayedComponent } from './orders-delayed.component';

describe('OrdersDelayedComponent', () => {
  let component: OrdersDelayedComponent;
  let fixture: ComponentFixture<OrdersDelayedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersDelayedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersDelayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
