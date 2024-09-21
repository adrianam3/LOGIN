import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioridadListComponent } from './prioridad-list.component';

describe('PrioridadListComponent', () => {
  let component: PrioridadListComponent;
  let fixture: ComponentFixture<PrioridadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrioridadListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrioridadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
