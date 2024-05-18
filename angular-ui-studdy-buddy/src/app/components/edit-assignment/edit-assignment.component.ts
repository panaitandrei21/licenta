// Import the QuillEditorComponent if not already imported
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
  imageData = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAmCAYAAABDClKtAAAAo0lEQVRYCe2WsQnDQBRD/wKeLht4AA+QMiNkA48U3JiAIemuTBVXueciC6gyKnRwneDEkw5UGJ4y9ERMqamEVEipBFRdOhVSKgFVV8P0w+3GlJpISIWUSkDVpVMhpRJQdelUSKkEVF29np2L2XypHWhLt9pUdV9hfZiZUnM+U1dt64w3r0lcH2B/m8U3N+DbuRr9wD+pzYyUZafO/FXqW5Yr4QAQAz+Xfmku5gAAAABJRU5ErkJggg==">';

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
      assignmentId: [''],
      title: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      category: [''],
      files: []
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignmentService.getAssignmentById(id).subscribe((assignment: Assignment) => {
        console.log(assignment.content)
        this.editForm.patchValue({
          assignmentId: assignment.assignmentId,
          title: assignment.title,
          createdBy: assignment.createdBy,
          createdDate: assignment.createdDate,
          category: assignment.category,
          files: this.b64DecodeUnicode(assignment.content)
        });
      });
    }
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      // this.assignmentService.updateAssignment(this.editForm.value).subscribe(() => {
      //   this.router.navigate(['/admin']); // Navigate back to the admin page after saving
      // });
    }
  }

  // b64DecodeUnicode(str: any): string {
  //   const shit = decodeURIComponent((atob(str).split('').map(function(c) {
  //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //   }).join('')));
  //   console.log(shit);
  //   return shit;
  // }
  b64DecodeUnicode(str: any): string {
    const decoded = decodeURIComponent(Array.from(atob(str), (c) =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    const cleaned = decoded.replace(/\\/g, '');
    console.log("Decoded and cleaned content:", cleaned);
    return cleaned;
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  get title() {
    return this.editForm.get('title');
  }


}
