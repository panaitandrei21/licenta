import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleCoursesComponent } from './handle-courses.component';

describe('HandleCoursesComponent', () => {
  let component: HandleCoursesComponent;
  let fixture: ComponentFixture<HandleCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HandleCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandleCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
