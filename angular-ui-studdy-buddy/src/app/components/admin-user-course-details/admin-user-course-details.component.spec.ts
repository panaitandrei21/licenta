import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserCourseDetailsComponent } from './admin-user-course-details.component';

describe('AdminUserCourseDetailsComponent', () => {
  let component: AdminUserCourseDetailsComponent;
  let fixture: ComponentFixture<AdminUserCourseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserCourseDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUserCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
