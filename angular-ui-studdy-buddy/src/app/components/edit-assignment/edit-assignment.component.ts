import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import {Assignment} from "../../interfaces/course";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AssignmentService} from "../../services/assignment.service";

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {
  editForm: FormGroup;
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent;

  modules = {
    syntax: true,
    toolbar:[
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
      ['image'],
      ['code-block']
    ],
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private assignmentService: AssignmentService
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      category: [''],
      files: [],
      solutionFiles: []
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignmentService.getAssignmentById(id).subscribe((assignment: Assignment) => {
        console.log(assignment.createdDate);
        assignment.createdDate ? this.formatDate(assignment.createdDate) : '';
        this.editForm.patchValue({
          title: assignment.title,
          category: assignment.category,
          files: this.b64DecodeUnicode(assignment.content),
          solutionFiles: this.b64DecodeUnicode(assignment.solution),
        });
      });
    }
  }

  private formatDate(dateString: Date): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  saveChanges(): void {
    if (this.editForm.valid) {
      // this.assignmentService.updateAssignment(this.editForm.value).subscribe(() => {
      //   this.router.navigate(['/admin']); // Navigate back to the admin page after saving
      // });
    }
  }

  b64DecodeUnicode(str: any): string {
    const decoded = decodeURIComponent(Array.from(atob(str), (c) =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    const cleaned = decoded.replace(/\\/g, '');
    return cleaned;
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  get title() {
    return this.editForm.get('title');
  }


}
