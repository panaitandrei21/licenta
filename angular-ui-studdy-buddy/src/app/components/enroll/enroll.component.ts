import { Component } from '@angular/core';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrl: './enroll.component.css'
})
export class EnrollComponent {
  shoes = [
    {value: 'sneakers-0', viewValue: 'Sneakers'},
    {value: 'boots-1', viewValue: 'Boots'},
    {value: 'clogs-2', viewValue: 'Clogs'},
    // Add more options here
  ];
}
