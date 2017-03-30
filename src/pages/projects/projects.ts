import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { StoreService } from "../../services/store";
import { ProjectFormPage } from "../project-form/project-form";
import { contains, values, map, toLower, reject, is, or, isEmpty } from 'ramda';
import logger from '../../logger';
import { FormControl } from "@angular/forms";
import { SearchPipe } from '../../pipes/search';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html'
})
export class ProjectsPage {

  projects: any;
  term: string = '';
  searchForm: FormControl;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public navParams: NavParams,
    public store: StoreService,
    private sanitizer: DomSanitizer
  ) {

    this.menu.enable(true);
    this.projects = this.store.list('projects', true);
    this.searchForm = new FormControl();

    this.searchForm.valueChanges
      .debounceTime(50) // keep a bit of a delay it's a deep search
      .subscribe(
      search => this.term = search,
      err => logger('error', 'error searching..', err)
      );

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

  newProject(): void {
    logger('trace', 'making new project')
    this.navCtrl.push(ProjectFormPage);
  }

}
