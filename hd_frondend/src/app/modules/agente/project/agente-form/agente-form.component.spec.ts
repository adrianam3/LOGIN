import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenteFormComponent } from './agente-form.component';

describe('AgenteFormComponent', () => {
  let component: AgenteFormComponent;
  let fixture: ComponentFixture<AgenteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenteFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgenteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
