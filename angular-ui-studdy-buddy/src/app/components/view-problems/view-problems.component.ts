import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchResults } from '../../interfaces/search-result';
import { CourseService } from '../../services/course.service';
import {Params, Router} from '@angular/router';

@Component({
  selector: 'app-view-problems',
  templateUrl: './view-problems.component.html',
  styleUrls: ['./view-problems.component.css']
})
export class ViewProblemsComponent implements OnInit {
  searchTableForm: FormGroup;
  searchResults: SearchResults;
  searchParams: Params = {};
  page: number = 0;

  constructor(private courseService: CourseService, private fb: FormBuilder, private router: Router) {
    this.searchResults = {
      assignments: [],
      totalPages: 1
    }
    this.searchTableForm = this.fb.group({
      assignmentId: this.fb.control(''),
      title: this.fb.control(''),
      createdDate: this.fb.control(''),
      category: this.fb.control(''),
      createdBy: this.fb.control('')
    });
  }

  search() {
    this.page = 0;
    this.searchParams = this.searchTableForm.value;
    console.log(this.searchParams);
    this.searchAssignments();
  }

  searchAssignments() {
    this.courseService.searchAssignments(this.appendSortAndPage()).subscribe({
      next: (response => {
        console.log(response);
        this.searchResults = response as SearchResults;
      })
    });
  }

  ngOnInit(): void {
    this.searchAssignments();
  }

  private appendSortAndPage() {
    return {
      ...this.searchParams,
      page: this.page
    };
  }

  openEdit() {

  }

  deleteItem() {

  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/edit-assignment', id]);
  }

}
