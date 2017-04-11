import { Component } from '@angular/core';
import { StoreService } from '../../services/store';
import { Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'actorModel.html'
})
export class ActorModelPage {
  actor;
  users: any[] = [];

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public store: StoreService
  ) {
    this.actor = this.params.get('actor');

    this.actor.USER.map(key => {
      console.log(key)
      const user = this.store.object(`users/${key}`);
      console.log(user)
      this.users.push(user)
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
