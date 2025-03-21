import { ComponentFixture, TestBed } from '@angular/core/testing';

import  InventariopbComponent  from './inventariopb.component';

describe('InventariopbComponent', () => {
  let component: InventariopbComponent;
  let fixture: ComponentFixture<InventariopbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventariopbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventariopbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
