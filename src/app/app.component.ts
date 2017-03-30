import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AuthService } from '../services/auth';
import { MainPage } from '../pages/main/main';
import { LoginPage } from '../pages/login/login';
import { ProjectsPage } from '../pages/projects/projects';
import { ActorenPage } from '../pages/actoren/actoren';

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
    public auth: AuthService
  ) {

    this.rootPage = MainPage;

    platform.ready()
      .then(_ => {
        StatusBar.styleDefault();
        Splashscreen.hide();
      });
  }

  ngOnInit(): void {
    this.platform.ready().then(_ => {
      this.auth.getUserData()
        .subscribe(data => {
          if (!this.isAppInitialized) {
            logger('info', 'user is logged in! goto to projects', data);
            this.menu.enable(true);
            this.nav.setRoot(ProjectsPage);
            this.isAppInitialized = true;
          }
          this.user = data;
        }, _ => {
          logger('info', 'not logged in, goto login page');
          this.menu.enable(false);
          this.nav.setRoot(LoginPage)
        });
    });
  }

  navigate(route): void {
    logger('info', 'goto route', route);
    const { page } = head(routes.filter(({ name }) => name === route))
    this.nav.setRoot(page);
  }

}
