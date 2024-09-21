import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenteListComponent } from './agente-list.component';

describe('AgenteListComponent', () => {
  let component: AgenteListComponent;
  let fixture: ComponentFixture<AgenteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenteListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgenteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
