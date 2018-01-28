import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, App, ActionSheetController, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ItemAddPage} from '../item-add/item-add';

@IonicPage()
@Component({
    selector: 'page-items-list',
    templateUrl: 'items-list.html',
})
export class ItemsListPage {
    items: Array<{}>;

    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public appCtrl: App,
        private storage: Storage,
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController
    ) {
        this.storage.get('items').then((value) => {
            this.items = value || [];
        });
    }

    /**
     * Shows action sheet with item options
     */
    showItemActions(itemTitle) {
        let itemActions = this.actionSheetCtrl.create({
            title: `${itemTitle} options`,
            buttons: [
                {
                    text: 'Delete',
                    icon: 'remove',
                    handler: () => {
                        this.showDeleteConfirm(itemTitle);
                    }
                },
                {
                    text: 'Increment',
                    icon: 'add',
                    handler: () => {
                        // @todo: Add action to increase item value by set default increment value
                    }
                }, {
                    text: 'Edit',
                    icon: 'create',
                    handler: () => {
                        // @todo: Open item edit view
                    }
                }, {
                    text: 'Cancel',
                    icon: 'close',
                    handler: () => {

                    }
                }
            ]
        });

        itemActions.present();
    }

    /**
     * Show confirmation alert, when attempting to delete item
     */
    showDeleteConfirm(itemTitle) {
        let confirm = this.alertCtrl.create({
            title: `Delete ${itemTitle}?`,
            message: `Do you really want to delete ${itemTitle} item?`,
            buttons: [
                {
                    text: 'No',
                    handler: () => {

                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        // @todo: Add delete fty
                    }
                }
            ]
        });

        confirm.present();
    }

    openItemAddView() {
        this.appCtrl.getRootNav().push(ItemAddPage);
    }
}
