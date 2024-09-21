import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseConocimientoListComponent } from './base-conocimiento-list.component';

describe('BaseConocimientoListComponent', () => {
  let component: BaseConocimientoListComponent;
  let fixture: ComponentFixture<BaseConocimientoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseConocimientoListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseConocimientoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
