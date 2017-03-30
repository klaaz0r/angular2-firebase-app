import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { StoreService } from "../../services/store";
import { length } from 'ramda';
import logger from '../../logger';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-actoren',
  templateUrl: 'actoren.html'
})
export class ActorenPage {

  actoren: any;
  selectedActor: any;
  term: string = '';
  searchForm: FormControl;
  actorForm: FormGroup;
  actorCreateStatus: boolean = false;
  totalActoren: number;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public navParams: NavParams,
    public store: StoreService,
    private sanitizer: DomSanitizer,
    public toastCtrl: ToastController,
    public form: FormBuilder
  ) {

    this.actorForm = this.form.group({
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      description: ['',]
    });

    this.menu.enable(true);
    this.actoren = this.store.list('actors');
    this.totalActoren = this.actoren.map(ac => length(ac))

    this.searchForm = new FormControl();

    this.searchForm.valueChanges
      .debounceTime(10) // keep a bit of a delay it's a deep search
      .subscribe(
      search => this.term = search,
      err => logger('error', 'error searching..', err)
      );
  }

  toggleCreateStatus(): void {
    logger('info', 'toggleCreateStatus');
    if (this.actorCreateStatus) {
      this.actorCreateStatus = false
    } else {
      this.actorCreateStatus = true;
    }
  }

  presentToast(message: string): void {
    this.toastCtrl.create({
      message: message,
      duration: 1000
    }).present();
  }

  delete(key): void {
    logger('info', 'deleting project', key)
    this.store.remove(`actors/${key}`);
    this.presentToast('deleted actor');
  }

  save(actorObj: any, isValid: boolean, event: Event): void {
    event.preventDefault();// prevent default submit behavior
    if (this.selectedActor) {
      logger('info', 'update project', { key: this.selectedActor.$key, actorObj });
      this.store.update(`actors/${this.selectedActor.$key}`, actorObj);
    } else {
      logger('info', 'new actor', actorObj);
      this.store.push('actors', actorObj);
    }
    this.actorCreateStatus = false;
    this.presentToast(`saved actor ${actorObj.name}`)
  }

}
