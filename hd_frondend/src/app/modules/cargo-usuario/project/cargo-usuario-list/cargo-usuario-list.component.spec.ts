import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoUsuarioListComponent } from './cargo-usuario-list.component';

describe('CargoUsuarioListComponent', () => {
  let component: CargoUsuarioListComponent;
  let fixture: ComponentFixture<CargoUsuarioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoUsuarioListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargoUsuarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
