import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersAvLessFourteenDdComponent } from './orders-av-less-fourteen-dd.component';

describe('OrdersAvLessFourteenDdComponent', () => {
  let component: OrdersAvLessFourteenDdComponent;
  let fixture: ComponentFixture<OrdersAvLessFourteenDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersAvLessFourteenDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersAvLessFourteenDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
