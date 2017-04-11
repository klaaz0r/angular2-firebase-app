import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, ModalController, Platform } from 'ionic-angular';
import { StoreService } from '../../services/store';
import { AuthService } from '../../services/auth';
import { ProjectFormPage } from '../project-form/project-form';
import logger from '../../logger';
import { FormControl } from '@angular/forms';
import { ActorModelPage } from '../actoren/actorModel';
import { merge, map } from 'ramda';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html'
})
export class ProjectsPage {

  projects: any;
  term: string = '';
  searchForm: FormControl;
  user: any;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public navParams: NavParams,
    public store: StoreService,
    private sanitizer: DomSanitizer,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public auth: AuthService
  ) {

    this.menu.enable(true);
    this.projects = this.store.list('projects', true)
      .map(projects => {
        //let's not trust android people to
        //always set an archive property
        const newProjects = map(project =>
          merge({ archive: false }, project), projects)
        //sort them
        return newProjects.sort((a, b) => a.archive > b.archive)
      })
      .catch(err => logger('error', 'could not get project', { err }));

    this.searchForm = new FormControl();

    this.searchForm.valueChanges
      .debounceTime(50) // keep a bit of a delay it's a deep search
      .subscribe(
      search => this.term = search,
      err => logger('error', 'error searching..', err)
      );

    this.user = this.auth.getUser();
  }

  showActor(actor: any): void {
    actor.subscribe(actor => {
      logger('info', 'open actor model', actor);
      this.modalCtrl.create(ActorModelPage, { actor }).present();
    }, err => logger('error', 'error populating actor for model', err))
  }

  ionViewWillLeave(): void {
    //reset the search form on leaving
    this.searchForm.reset();
  }

  gotoProject($key): void {
    logger('trace', 'going to route', $key)
    //pass key to the route, open the correct one
    this.navCtrl.push(ProjectFormPage, { key: $key });
  }

  archiveProject($key): void {
    logger('info', 'archiving project', $key)
    this.store.update(`projects/${$key}`, { archive: true })
    this.toastCtrl.create({ message: 'project gearchiveerd', duration: 750 }).present();
  }

  newProject(): void {
    logger('trace', 'making new project')
    this.navCtrl.push(ProjectFormPage);
  }

}
