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
import {ItemInterface, ItemProvider} from '../../providers/item/item';
import {IncrementProvider} from '../../providers/increment/increment';
import {ResetIntervalProvider} from '../../providers/reset-interval/reset-interval';

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
        private itemProvider: ItemProvider,
        private incrementProvider: IncrementProvider,
        private resetIntervalProvider: ResetIntervalProvider
    ) {
        this.itemProvider.getAllItems().then((items) => {
            this.items = items;

            this.items.forEach(item => {
                this.getItemTotalIncrementValue(item).then(value => {
                    item.total_increment = value;
                });
            });
        });
    }

    /**
     * Calculate currently active reset interval increment.
     *
     * @param {ItemInterface} item
     * @returns {Promise<number>}
     */
    getItemTotalIncrementValue(item) {
        let totalIncrementValue = 0;
        return this.incrementProvider.getItemIncrements(item.id).then(increments => {
            increments.filter(increment => {
                if (!item.reset_enabled || increment.created_at >= this.resetIntervalProvider.getIntervalStartDate(item.reset)) {
                    totalIncrementValue += parseFloat(increment.value);
                    return true;
                }

                return false;
            });

            return totalIncrementValue;
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
                        this.addItemIncrement(item);
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
     * Add new item increment.
     *
     * @param item
     */
    addItemIncrement(item) {
        this.incrementProvider.getItemIncrements(item.id).then((increments) => {
            increments.push({
                id: item.id,
                value: item.increment,
                unit: item.unit === 'other' ? item.unit_other : item.unit,
                created_at: Date.now().toString()
            });

            this.incrementProvider.saveItemIncrements(item.id, increments).then(() => {
                this.getItemTotalIncrementValue(item).then(value => {
                    item.total_increment = value;
                });
            });
        });
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
                        this.itemProvider.deleteItem(item.id).then((id) => {
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
