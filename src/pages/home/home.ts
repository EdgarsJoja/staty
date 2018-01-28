import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { ItemsListPage } from '../items-list/items-list';
import { StatisticsPage } from '../statistics/statistics';
import { SettingsPage } from '../settings/settings';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    itemsListPage: any = ItemsListPage;
    statisticsPage: any = StatisticsPage;

    constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App) {

    }

    openSettingsView() {
        this.appCtrl.getRootNav().push(SettingsPage);
    }
}
