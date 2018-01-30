import {Component} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    App,
    ActionSheetController,
    AlertController,
    reorderArray
} from 'ionic-angular';
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

    /**
     * Shows action sheet with item options
     */
    showItemActions(itemTitle: String) {
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
    showDeleteConfirm(itemTitle: String) {
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

    /**
     * Reorder list items and update storage
     *
     * @param indexes
     */
    reorderItems(indexes) {
        this.items = reorderArray(this.items, indexes);
        this.storage.set('items', this.items);
    }

    openItemAddView() {
        this.appCtrl.getRootNav().push(ItemAddPage);
    }
}
