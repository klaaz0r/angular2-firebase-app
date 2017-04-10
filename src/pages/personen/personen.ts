import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Personen page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-personen',
  templateUrl: 'personen.html'
})
export class PersonenPage {
  users: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.users = this.store.list('users')
  }

}
