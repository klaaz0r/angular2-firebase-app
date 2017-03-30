import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  title: String = ' ';

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams) {
    events.subscribe('title:updated', (data) => {
      if (data.menuState) {
        this.title = "Projects";
      } else {
        this.title = ' ';
      }
    });
  }
}
