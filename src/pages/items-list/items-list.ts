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

import {ItemAddPage} from '../item-add/item-add';
import {ItemInterface, ItemProvider} from "../../providers/item/item";

@IonicPage()
@Component({
    selector: 'page-items-list',
    templateUrl: 'items-list.html',
})
export class ItemsListPage {
    items: Array<ItemInterface>;

    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public appCtrl: App,
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        private itemProvider: ItemProvider
    ) {
        this.itemProvider.getAllItems().then((items) => {
            this.items = items;
        });
    }

    /**
     * Shows action sheet with item options
     *
     * @param item
     */
    showItemActions(item) {
        let itemActions = this.actionSheetCtrl.create({
            title: `${item.title} options`,
            buttons: [
                {
                    text: 'Delete',
                    icon: 'remove',
                    handler: () => {
                        this.showDeleteConfirm(item);
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
                        this.openItemAddView(item);
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
     *
     * @param item
     */
    showDeleteConfirm(item) {
        let confirm = this.alertCtrl.create({
            title: `Delete ${item.title}?`,
            message: `Do you really want to delete ${item.title} item?`,
            buttons: [
                {
                    text: 'No',
                    handler: () => {

                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.itemProvider.deleteItemById(item.id).then((id) => {
                            this.items.splice(this.items.findIndex((item) => item.id === id),1);
                        });
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
        this.itemProvider.saveItems(this.items);
    }

    /**
     * Opens Edit/Add item view
     *
     * @param {{}} item
     */
    openItemAddView(item = {}) {
        this.appCtrl.getRootNav().push(ItemAddPage, {
            item: item
        });
    }
}
