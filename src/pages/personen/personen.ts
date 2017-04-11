import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StoreService } from '../../services/store';
import { FormControl } from '@angular/forms'
import logger from '../../logger';

@Component({
  selector: 'page-personen',
  templateUrl: 'personen.html'
})
export class PersonenPage {
  users: any;
  searchForm: FormControl;
  term: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public store: StoreService
  ) {
    // this.users = this.store.list('users')
    this.users = this.store.list('users');

    this.searchForm = new FormControl();
    this.searchForm.valueChanges
      .debounceTime(10) // keep a bit of a delay it's a deep search
      .subscribe(
      search => this.term = search,
      err => logger('error', 'error searching..', { err })
      );

  }

  toggleAdmin(user): void {
    logger('debug', 'toggleing admin', { user })
    if (user.admin) {
      this.store.update(`users/${user.$key}`, { admin: false });
    } else {
      this.store.update(`users/${user.$key}`, { admin: true });
    }
  }

}
