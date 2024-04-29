import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeUserCoursesComponent } from './see-user-courses.component';

describe('SeeUserCoursesComponent', () => {
  let component: SeeUserCoursesComponent;
  let fixture: ComponentFixture<SeeUserCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeeUserCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeeUserCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
