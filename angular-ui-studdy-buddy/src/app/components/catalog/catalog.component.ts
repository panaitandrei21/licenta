import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Params, Router } from "@angular/router";
import { AssignmentService } from "../../services/assignment.service";
import { ToastrService } from "ngx-toastr";
import { SearchReviewResults } from "../../interfaces/search-result";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  searchTableForm: FormGroup;
  searchResults: SearchReviewResults = { content: [], totalPages: 1 };
  searchParams: Params = {};
  page: number = 0;
  pageSize: number = 20;

  constructor(
    private assignmentService: AssignmentService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.searchTableForm = this.fb.group({
      courseName: '',
    });
  }

  search() {
    this.page = 0;
    this.searchParams = this.searchTableForm.value;
    console.log(this.searchParams);
    this.searchReview();
  }

  searchReview() {
    this.assignmentService.searchReview(this.searchParams, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.searchResults = response as SearchReviewResults;
        console.log(this.searchResults);
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      }
    });
  }

  ngOnInit(): void {
    this.searchReview();
  }

  goToPage(page: number) {
    this.page = page;
    this.searchReview();
  }
}
