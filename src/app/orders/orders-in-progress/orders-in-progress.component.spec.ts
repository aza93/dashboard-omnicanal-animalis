import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersInProgressComponent } from './orders-in-progress.component';

describe('OrdersInProgressComponent', () => {
  let component: OrdersInProgressComponent;
  let fixture: ComponentFixture<OrdersInProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersInProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
