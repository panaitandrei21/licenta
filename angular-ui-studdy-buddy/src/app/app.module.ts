import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { AdminComponent } from './components/admin/admin.component';
import {DropdownModule} from "primeng/dropdown";
import {authInterceptor} from "./components/interceptors/auth.interceptor";
import {AgGridAngular} from "ag-grid-angular";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EnrollComponent } from './components/enroll/enroll.component';
import {MatList, MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import { CourseComponent } from './components/course/course.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ModuleformComponent } from './components/moduleform/moduleform.component';
import { SeeUserCoursesComponent } from './components/see-user-courses/see-user-courses.component';
import { EditModuleComponent } from './components/edit-module/edit-module.component';
import { RemoveUUIDPipe } from './pipe/remove-uuid.pipe';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { AdminHandleUserComponent } from './components/admin-handle-user/admin-handle-user.component';
import { AdminHandleCoursesComponent } from './components/admin-handle-courses/admin-handle-courses.component';
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatToolbar} from "@angular/material/toolbar";
import { AdminUserCourseDetailsComponent } from './components/admin-user-course-details/admin-user-course-details.component';
import { AddProblemsComponent } from './components/add-problems/add-problems.component';
import {EditorModule, TINYMCE_SCRIPT_SRC} from "@tinymce/tinymce-angular";
import {QuillModule} from "ngx-quill";
import { ViewProblemsComponent } from './components/view-problems/view-problems.component';
import { EditAssignmentComponent } from './components/edit-assignment/edit-assignment.component';
import { AddHomeworkComponent } from './components/add-homework/add-homework.component';
import { ViewAssignmentInstanceComponent } from './components/view-assignment-instance/view-assignment-instance.component';
import {ToastrModule} from "ngx-toastr";
import {NgxFileDropModule} from "ngx-file-drop";
import {DragDropModule} from "@angular/cdk/drag-drop";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AdminComponent,
    EnrollComponent,
    CourseComponent,
    NavBarComponent,
    ProfileComponent,
    ModuleformComponent,
    SeeUserCoursesComponent,
    EditModuleComponent,
    RemoveUUIDPipe,
    EditCourseComponent,
    AdminHandleUserComponent,
    AdminHandleCoursesComponent,
    AdminUserCourseDetailsComponent,
    AddProblemsComponent,
    ViewProblemsComponent,
    EditAssignmentComponent,
    AddHomeworkComponent,
    ViewAssignmentInstanceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule,
    DropdownModule,
    AgGridAngular,
    MatSelectionList,
    MatListOption,
    MatList,
    MatListItem,
    MatOption,
    MatSelect,
    MatToolbar,
    EditorModule,
    QuillModule.forRoot(),
    ToastrModule.forRoot(),
    DragDropModule
  ],
  providers: [
    provideClientHydration(),
    MessageService,
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
