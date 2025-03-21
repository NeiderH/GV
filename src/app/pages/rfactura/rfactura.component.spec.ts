import { ComponentFixture, TestBed } from '@angular/core/testing';

import  RfacturaComponent  from './rfactura.component';

describe('RfacturaComponent', () => {
  let component: RfacturaComponent;
  let fixture: ComponentFixture<RfacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfacturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
