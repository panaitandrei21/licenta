import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchResults } from '../../interfaces/search-result';
import { CourseService } from '../../services/course.service';
import {Params, Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {AssignmentService} from "../../services/assignment.service";

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
  @Output() assignmentSelected = new EventEmitter<any>();

  constructor(private assignmentService: AssignmentService, private fb: FormBuilder, private router: Router,
              private toastr: ToastrService) {
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
    this.assignmentService.searchAssignments(this.appendSortAndPage()).subscribe({
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
  deleteItem(assignmentId: string) {
    this.assignmentService.deleteAssignment(assignmentId).subscribe({
      next: (response => {
        this.searchResults.assignments = this.searchResults.assignments.filter(assignment => assignment.assignmentId !== assignmentId);
        this.toastr.success(`Assignment deleted successfully ${assignmentId}`, 'Success');
      }),
      error: (err) => this.toastr.error(err, 'Error')

    });
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/edit-assignment', id]);
  }

  selectAssignment(assignment: any) {
    console.log(assignment);
    this.assignmentSelected.emit(assignment);
  }
}
