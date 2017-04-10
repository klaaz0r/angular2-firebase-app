import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../services/auth';
import { MainPage } from '../pages/main/main';
import { LoginPage } from '../pages/login/login';
import { ProjectsPage } from '../pages/projects/projects';
import { ActorenPage } from '../pages/actoren/actoren';
import { CameraComponent } from '../pages/camera/camera';

import { head } from 'ramda';
import logger from '../logger';

const routes = [
  { name: 'actoren', page: ActorenPage },
  { name: 'projecten', page: ProjectsPage }
];

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  user: any;
  rootPage: any = LoginPage;
  isAppInitialized = false;

  constructor(
    public menu: MenuController,
    public platform: Platform,
    public events: Events,
    public auth: AuthService,
    public modalCtrl: ModalController,
    public translate: TranslateService
  ) {

    translate.setDefaultLang('en');

    this.rootPage = MainPage;

    platform.ready()
      .then(() => {
        StatusBar.styleDefault();
        Splashscreen.hide();
      });

    this.platform.ready().then(() => {
      this.auth.getUserData()
        .subscribe(data => {
          if (!this.isAppInitialized) {
            logger('info', 'user is logged in! goto to projects', data);
            this.menu.enable(true);
            this.nav.setRoot(ProjectsPage);
            this.isAppInitialized = true;
          }
          this.user = data;
        }, err => {
          logger('warn', 'not logged in, goto login page', { err });
          this.menu.enable(false);
          this.nav.setRoot(LoginPage)
        });
    });
  }

  changeLanguage(language): void {
    this.translate.setDefaultLang(language);
  }

  screenshot(): void {
    this.modalCtrl.create(CameraComponent).present();
  }

  navigate(route): void {
    logger('info', 'goto route', route);
    const { page } = head(routes.filter(({ name }) => name === route))
    this.menu.enable(false);
    this.nav.setRoot(page);
  }

}
