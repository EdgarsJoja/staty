import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    App,
    ActionSheetController,
    AlertController,
    reorderArray,
    Events,
    ModalController
} from 'ionic-angular';

import { ItemAddPage } from '../item-add/item-add';
import { AdvancedIncrementAddPage } from '../advanced-increment-add/advanced-increment-add';

import { ItemInterface, ItemProvider } from '../../providers/item/item';
import { IncrementProvider } from '../../providers/increment/increment';
import { ResetIntervalProvider } from '../../providers/reset-interval/reset-interval';
import { SettingsProvider } from '../../providers/settings/settings';
import { DateProvider } from '../../providers/date/date';

@IonicPage()
@Component({
    selector: 'page-items-list',
    templateUrl: 'items-list.html',
})
export class ItemsListPage {
    items: Array<ItemInterface> = [];

    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public appCtrl: App,
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        private itemProvider: ItemProvider,
        private incrementProvider: IncrementProvider,
        private resetIntervalProvider: ResetIntervalProvider,
        private settingsProvider: SettingsProvider,
        private events: Events,
        private modalCtrl: ModalController,
        private dateProvider: DateProvider
    ) {
        this.recalculateIncrements();

        this.events.subscribe('increments:recalculate', () => {
            this.recalculateIncrements();
        });
    }

    /**
     * Generate total value text
     *
     * @param item
     * @returns {string}
     */
    getItemTotalValueText(item) {
        // @todo: Add different text based on item interval
        return `Total ${item.total_increment} ${item.unit !== 'other' ? item.unit : item.unit_other}`;
    }

    /**
     * Calculate currently active reset interval increment.
     *
     * @param {ItemInterface} item
     * @returns {Promise<object>}
     */
    getItemIncrementData(item) {
        let totalIncrementValue = 0;
        let lastUpdatedAt = null;

        return this.incrementProvider.getItemIncrements(item.id).then(increments => {
            if (increments.length === 0) {
                return {
                    total: totalIncrementValue,
                    updated_at: lastUpdatedAt
                };
            }

            return this.settingsProvider.getSettings().then(settings => {
                increments.forEach(increment => {
                    if (!item.reset_enabled
                        || increment.created_at >= this.resetIntervalProvider.getIntervalStartDate(item.reset, settings.first_day_of_week)
                    ) {
                        totalIncrementValue += parseFloat(increment.value);
                    }
                });

                // Max 3 decimal places
                totalIncrementValue = Math.round(totalIncrementValue * 1000) / 1000;

                // Get last updated increment
                const sortedIncrements = increments.sort((a, b) => a.created_at < b.created_at);
                lastUpdatedAt = sortedIncrements[0].created_at;

                return {
                    total: totalIncrementValue,
                    updated_at: lastUpdatedAt
                };
            });
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
                    text: 'Advanced',
                    icon: 'add',
                    handler: () => {
                        this.openAdvancedPopup(item);
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
        // To not trigger action sheet for item
        event.stopPropagation();

        this.incrementProvider.addItemIncrement(item).then((status) => {
            if (status) {
                this.updateItemIncrementData(item);
            }
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

    /**
     * Recalculates increment values for all items
     */
    private recalculateIncrements() {
        this.itemProvider.getAllItems().then((items) => {
            this.items = items || [];

            this.items.forEach(item => {
                this.updateItemIncrementData(item);
            });
        });
    }


    /**
     * private openAdvancedPopup - Opens advanced increment form
     *
     * @param  {Item} item = {} Item
     */
    private openAdvancedPopup(item = {}) {
        let advancedIncrementModal = this.modalCtrl.create(AdvancedIncrementAddPage, {
            item: item
        });
        advancedIncrementModal.present();
    }


    /**
     * private updateItemIncrementData - Adds additional data for item
     *
     * @param  {type} item
     * @return {type}
     */
    private updateItemIncrementData(item) {
        this.getItemIncrementData(item).then(data => {
            item.total_increment = data.total;
            item.total_text = this.getItemTotalValueText(item);

            item.updated_at = this.dateProvider.getFormattedTimePassed(data.updated_at);
        });
    }
}
