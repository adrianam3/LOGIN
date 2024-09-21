import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaListComponent } from './sla-list.component';

describe('SlaListComponent', () => {
  let component: SlaListComponent;
  let fixture: ComponentFixture<SlaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
