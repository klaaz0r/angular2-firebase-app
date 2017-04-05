import { Component } from '@angular/core';
import { StoreService } from "../../services/store";
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'actorModel.html'
})
export class ActorModelPage {
  actor;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public store: StoreService
  ) {
    this.actor = this.params.get('actor')
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
