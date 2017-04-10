import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//services
import { AuthService } from '../services/auth';
import { StoreService } from '../services/store';

//pipes
import { SearchPipe } from '../pipes/search';

//pages
import { MainPage }  from '../pages/main/main';
import { LoginPage } from '../pages/login/login';
import { ProjectsPage } from '../pages/projects/projects';

import { PersonenPage } from '../pages/personen/personen';

import { ActorenPage } from '../pages/actoren/actoren';
import { ActorModelPage } from '../pages/actoren/actorModel';

import { ProjectFormPage } from '../pages/project-form/project-form';
import { LogoutComponent } from './logout/logout.component';
import { CameraComponent } from '../pages/camera/camera';

const config = {
  apiKey: 'AIzaSyDXEoiQb4w87pAGRjtic6n_hQRZnxqpenU',
  authDomain: 'actortemplateapp-b0783.firebaseapp.com',
  databaseURL: 'https://actortemplateapp-b0783.firebaseio.com',
  storageBucket: 'actortemplateapp-b0783.appspot.com',
  messagingSenderId: '1050283242427'
};

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/translations/', '.json');
};

@NgModule({
  declarations: [
    MyApp,
    MainPage,
    LoginPage,
    ActorenPage,
    ProjectsPage,
    ProjectFormPage,
    LogoutComponent,
    SearchPipe,
    ActorModelPage,
    CameraComponent,
    PersonenPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp,
    MainPage,
    LoginPage,
    ActorenPage,
    ProjectsPage,
    ProjectFormPage,
    LogoutComponent,
    ActorModelPage,
    CameraComponent,
    PersonenPage
  ],
  providers: [AuthService, StoreService, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
