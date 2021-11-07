import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AuthTabsComponent } from 'src/app/components/auth-tabs/auth-tabs.component';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';




@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthTabsComponent,
    LoginComponent,
    SignupComponent
  ],
  exports:[
    AuthTabsComponent,
    LoginComponent,
    SignupComponent
  ],
  providers:[AuthService]
})
export class AuthModule { }
