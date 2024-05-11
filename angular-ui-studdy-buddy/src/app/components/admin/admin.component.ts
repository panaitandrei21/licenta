import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  selectedOption: string = 'courses'; // Default selection
  options = [
    { label: 'Courses', value: 'courses' },
    { label: 'Users', value: 'users' },
    { label: 'Handle Users', value: 'handle-users' },
    { label: 'Add Problems', value: 'add-problems' }
  ];

  onOptionChange(event: any) {
    this.selectedOption = event.value;
  }

}
