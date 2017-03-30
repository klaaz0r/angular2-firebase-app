import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { ProjectsPage } from '../projects/projects';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  error: any;
  loginForm: FormGroup;
  registerForm: FormGroup;
  toggleRegisterForm: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    private form: FormBuilder,
  ) {

    this.loginForm = this.form.group({
      email: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });

    this.registerForm = this.form.group({
      email: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });
  }

  toggleRegister() {
    this.toggleRegisterForm = true;
  }

  register(credentials: any) {
    console.log(credentials)
    this.auth.registerUser(credentials)
      .subscribe(data => {
        console.log(data)
        this.toggleRegisterForm = false;
        // this.navCtrl.setRoot(ProjectsPage);
      }, err => {
        console.log(err)
        this.error = err;
      });
  }

  loginWithEmail(credentials: any, isValid: boolean): void {
    console.log(credentials)
    this.auth.loginWithEmail(credentials)
      .subscribe(data => {
        console.log(data)
        this.navCtrl.setRoot(ProjectsPage);
      }, err => {
        console.log(err)
        this.error = err;
      });
  }

  loginWithGithub() {
    this.auth.loginWithGithub()
      .subscribe(data => {
        console.log(data)
        this.navCtrl.setRoot(ProjectsPage);
      }, err => {
        console.log(err)
        this.error = err;
      });
  }

}
