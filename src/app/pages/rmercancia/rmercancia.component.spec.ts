import { ComponentFixture, TestBed } from '@angular/core/testing';

import RmercanciaComponent  from './rmercancia.component';

describe('RmercanciaComponent', () => {
  let component: RmercanciaComponent;
  let fixture: ComponentFixture<RmercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmercanciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RmercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
