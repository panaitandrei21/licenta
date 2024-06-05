import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import {AdminComponent} from "./components/admin/admin.component";
import {authGuard} from "./guards/auth.guard";
import {hasRoleGuard} from "./guards/has-role.guard";
import {CourseComponent} from "./components/course/course.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {EditModuleComponent} from "./components/edit-module/edit-module.component";
import {EditCourseComponent} from "./components/edit-course/edit-course.component";
import {EditAssignmentComponent} from "./components/edit-assignment/edit-assignment.component";
import {
  ViewAssignmentInstanceComponent
} from "./components/view-assignment-instance/view-assignment-instance.component";
import {ViewSubmissionsComponent} from "./components/view-submissions/view-submissions.component";
import {ReviewSubmissionComponent} from "./components/review-submission/review-submission.component";
import {AddProblemsComponent} from "./components/add-problems/add-problems.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin', component: AdminComponent, canActivate: [authGuard, hasRoleGuard], data: {
    role: 'ROLE_ADMIN',
    }},
  {path: 'home', component: HomeComponent, canActivate: [authGuard, hasRoleGuard],  data: {
      role: ['ROLE_STUDENT', 'ROLE_TEACHER'],
    }},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'course/:id', component: CourseComponent, canActivate: [authGuard, hasRoleGuard],  data: {
      role: ['ROLE_STUDENT', 'ROLE_TEACHER'],
    }},
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard, hasRoleGuard],  data: {
      role: ['ROLE_STUDENT', 'ROLE_TEACHER'],
    }},
  { path: 'edit/module/:id', component: EditModuleComponent, canActivate: [authGuard, hasRoleGuard],  data: {
      role: ['ROLE_STUDENT', 'ROLE_TEACHER'],
    }},
  { path: 'edit-course/:id', component: EditCourseComponent, canActivate: [authGuard, hasRoleGuard],  data: {
      role: ['ROLE_STUDENT', 'ROLE_TEACHER'],
    }},
  { path: 'edit-assignment/:id', component: EditAssignmentComponent,canActivate: [authGuard, hasRoleGuard],  data: {
      role: ['ROLE_ADMIN', 'ROLE_TEACHER'],
    }},
  { path: 'view/assignment/instance/:id', component: ViewAssignmentInstanceComponent,canActivate: [authGuard, hasRoleGuard],  data: {
      role: ['ROLE_STUDENT', 'ROLE_TEACHER'],
    }},
  {
    path: 'view/submissions/:assignmentInstanceId',
    component: ViewSubmissionsComponent,
    canActivate: [authGuard, hasRoleGuard],
    data: { role: ['ROLE_STUDENT', 'ROLE_TEACHER'] }
  },
  { path: 'course/:id/submissions', component: ViewSubmissionsComponent, canActivate: [authGuard, hasRoleGuard], data: { role: ['ROLE_TEACHER'] } },
  { path: 'course/:id/submissions/:submissionId', component: ReviewSubmissionComponent, canActivate: [authGuard, hasRoleGuard], data: { role: ['ROLE_TEACHER'] } },
  { path: 'add/problem', component: AddProblemsComponent, canActivate: [authGuard, hasRoleGuard], data: { role: ['ROLE_TEACHER'] } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
