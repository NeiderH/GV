import { ComponentFixture, TestBed } from '@angular/core/testing';

import  {PlatosybComponent}  from './platosyb.component';

describe('PlatosybComponent', () => {
  let component: PlatosybComponent;
  let fixture: ComponentFixture<PlatosybComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatosybComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatosybComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
