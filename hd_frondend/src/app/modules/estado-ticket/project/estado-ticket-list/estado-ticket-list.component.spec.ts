import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoTicketListComponent } from './estado-ticket-list.component';

describe('EstadoTicketListComponent', () => {
  let component: EstadoTicketListComponent;
  let fixture: ComponentFixture<EstadoTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoTicketListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstadoTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
