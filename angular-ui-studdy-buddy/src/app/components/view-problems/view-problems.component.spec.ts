import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProblemsComponent } from './view-problems.component';

describe('ViewProblemsComponent', () => {
  let component: ViewProblemsComponent;
  let fixture: ComponentFixture<ViewProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewProblemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
