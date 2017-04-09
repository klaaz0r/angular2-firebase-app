import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
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
    private toastCtrl: ToastController,
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
    this.auth.registerUser(credentials)
      .then(() => this.toggleRegisterForm = false)
      .catch(({ message }) =>
        this.toastCtrl.create({ message, duration: 3000, position: 'top' }).present()
      )
  }

  loginWithEmail(credentials: any, isValid: boolean): void {
    this.auth.loginWithEmail(credentials)
      .then(() => this.navCtrl.setRoot(ProjectsPage))
      .catch(err => this.error = err)
  }

  loginWithGithub(): void {
    this.auth.loginWithGithub()
      .then(() => this.navCtrl.setRoot(ProjectsPage))
      .catch(err => this.error = err)
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle()
      .then(() => this.navCtrl.setRoot(ProjectsPage))
      .catch(err => this.error = err)
  }

}
