import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import {AdminComponent} from "./components/admin/admin.component";
import {authGuard} from "./guards/auth.guard";
import {hasRoleGuard} from "./guards/has-role.guard";
import {CourseComponent} from "./components/course/course.component";

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
  { path: 'course/:id', component: CourseComponent }, // Assuming 'id' is a unique identifier for courses
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
