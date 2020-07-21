import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAvMoreFourteenDdComponent } from './order-av-more-fourteen-dd.component';

describe('OrderAvMoreFourteenDdComponent', () => {
  let component: OrderAvMoreFourteenDdComponent;
  let fixture: ComponentFixture<OrderAvMoreFourteenDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAvMoreFourteenDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAvMoreFourteenDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
