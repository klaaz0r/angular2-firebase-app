import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { ProjectsPage } from '../projects/projects';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });
  }

  toggleRegister() {
    this.toggleRegisterForm = true;
  }

  register(credentials: any) {
    this.auth.registerUser(credentials)
      .subscribe(() => {
        this.toggleRegisterForm = false;
      }, err => {
        this.error = err;
      });
  }

  loginWithEmail(credentials: any, isValid: boolean): void {
    this.auth.loginWithEmail(credentials)
      .subscribe(() => this.navCtrl.setRoot(ProjectsPage),
      err => this.error = err);
  }

  loginWithGithub(): void {
    this.auth.loginWithGithub()
      .subscribe(() => this.navCtrl.setRoot(ProjectsPage),
      err => this.error = err
      );
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle()
      .subscribe(
      () => this.navCtrl.setRoot(ProjectsPage),
      err => this.error = err
      );
  }

}
