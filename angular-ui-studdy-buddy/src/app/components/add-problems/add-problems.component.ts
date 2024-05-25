import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseService} from "../../services/course.service";
import {Assignment} from "../../interfaces/course";
import {ToastrService} from "ngx-toastr";
import {AssignmentService} from "../../services/assignment.service";


@Component({
  selector: 'app-add-problems',
  templateUrl: './add-problems.component.html',
  styleUrl: './add-problems.component.css'
})
export class AddProblemsComponent implements OnInit{
  modules = {};
  assignmentForm = this.fb.group({
    title: ['', Validators.required],
    content: [''],
    solution:[''],
    category: [''],

  });
  editorContent!: string;

  constructor(private fb: FormBuilder, private assignmentService: AssignmentService, private toastr: ToastrService) {
    this.modules = {
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

  }




  ngOnInit(): void {
  }

  publishProblem() {
    const editor = this.assignmentForm.value;
    console.log(editor);
  }



  onCreateAssignment() {
    const editor = this.assignmentForm.value;

    this.assignmentService.addAssignment(editor as Assignment).subscribe({
      next: res => this.toastr.success('Assignment edited successfully', 'Success'),
      error: err => this.toastr.error(err, 'Error')
    })
  }
  get title() {
    return this.assignmentForm.get('title');
  }
}
