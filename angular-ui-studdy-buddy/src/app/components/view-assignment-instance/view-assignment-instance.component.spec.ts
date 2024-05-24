import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignmentInstanceComponent } from './view-assignment-instance.component';

describe('ViewAssignmentInstanceComponent', () => {
  let component: ViewAssignmentInstanceComponent;
  let fixture: ComponentFixture<ViewAssignmentInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAssignmentInstanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAssignmentInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
