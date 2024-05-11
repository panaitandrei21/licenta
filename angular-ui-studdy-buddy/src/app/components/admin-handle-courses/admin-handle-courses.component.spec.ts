import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHandleCoursesComponent } from './admin-handle-courses.component';

describe('AdminHandleCoursesComponent', () => {
  let component: AdminHandleCoursesComponent;
  let fixture: ComponentFixture<AdminHandleCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHandleCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminHandleCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
