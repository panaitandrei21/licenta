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
import {MatList, MatListItem, MatListModule, MatListOption, MatSelectionList} from "@angular/material/list";
import { CourseComponent } from './components/course/course.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ModuleformComponent } from './components/moduleform/moduleform.component';
import { SeeUserCoursesComponent } from './components/see-user-courses/see-user-courses.component';
import { EditModuleComponent } from './components/edit-module/edit-module.component';

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
    EditModuleComponent
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
    MatListItem
  ],
  providers: [
    provideClientHydration(),
    MessageService,
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
