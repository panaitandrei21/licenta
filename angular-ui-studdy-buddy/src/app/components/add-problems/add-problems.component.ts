import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseService} from "../../services/course.service";
import {Assignment} from "../../interfaces/course";


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
    dueDate: [''],
    category: [''],

  });
  editorContent!: string;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
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

    this.courseService.addAssignment(editor as Assignment).subscribe(res => res)
  }
  get title() {
    return this.assignmentForm.get('title');
  }
}
