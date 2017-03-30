import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform, NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth'
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'logout',
  templateUrl: 'logout.html'
})
export class LogoutComponent {

  constructor(
    public menu: MenuController,
    public platform: Platform,
    public nav: Nav,
    public events: Events,
    public auth: AuthService,
    public navCtrl: NavController
  ) {}

  logout(): void {
    console.log('logging out')
    this.nav.setRoot(LoginPage);
    this.auth.logout();
  }

}
