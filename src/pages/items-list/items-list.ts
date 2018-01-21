import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-items-list',
  templateUrl: 'items-list.html',
})
export class ItemsListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
}
