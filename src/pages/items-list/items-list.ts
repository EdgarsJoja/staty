import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ItemAddPage } from '../item-add/item-add';

@IonicPage()
@Component({
    selector: 'page-items-list',
    templateUrl: 'items-list.html',
})
export class ItemsListPage {
    items: Array<{}>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App, private storage: Storage) {
        this.items = [];

        this.storage.get('items').then((items) => {
            let itemArr = [];

            for (let id in items) {
                if (items.hasOwnProperty(id)) {
                    itemArr.push(items[id]);
                }
            }

            this.items = itemArr;
        });
    }

    openItemAddView() {
        this.appCtrl.getRootNav().push(ItemAddPage);
    }
}
