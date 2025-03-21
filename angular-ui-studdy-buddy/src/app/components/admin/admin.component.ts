import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  selectedOption: string = 'courses';
  options = [
    { label: 'Courses', value: 'courses' },
    { label: 'Users', value: 'users' },
    { label: 'Handle Users', value: 'handle-users' },
    { label: 'Add Problems', value: 'add-problems' },
    { label: 'View Problems', value: 'view-problems' },
    { label: 'Handle Courses', value: 'handle-courses' }
  ];

  onOptionChange(event: any) {
    this.selectedOption = event.value;
  }

  exitViewProblems() {
    this.selectedOption = 'courses';
  }

}
