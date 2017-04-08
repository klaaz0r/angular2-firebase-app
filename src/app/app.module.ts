import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';

//services
import { AuthService } from '../services/auth';
import { StoreService } from '../services/store';

//pipes
import { SearchPipe } from '../pipes/search';

//pages
import { MainPage }  from '../pages/main/main';
import { LoginPage } from '../pages/login/login';
import { ProjectsPage } from '../pages/projects/projects';
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
    CameraComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainPage,
    LoginPage,
    ActorenPage,
    ProjectsPage,
    ProjectFormPage,
    LogoutComponent,
    ActorModelPage,
    CameraComponent
  ],
  providers: [AuthService, StoreService, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
