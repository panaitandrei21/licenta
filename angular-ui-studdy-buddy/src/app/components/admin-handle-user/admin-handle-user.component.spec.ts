import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHandleUserComponent } from './admin-handle-user.component';

describe('AdminHandleUserComponent', () => {
  let component: AdminHandleUserComponent;
  let fixture: ComponentFixture<AdminHandleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHandleUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminHandleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
