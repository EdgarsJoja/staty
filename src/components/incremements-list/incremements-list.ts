import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Events } from 'ionic-angular';

import { AdvancedIncrementAddPage } from '../../pages/advanced-increment-add/advanced-increment-add';

import { IncrementProvider, IncrementInterface } from '../../providers/increment/increment';
import { ItemInterface } from '../../providers/item/item';

@Component({
    selector: 'incremements-list',
    templateUrl: 'incremements-list.html',
    inputs: ['item', 'initialCount']
})
export class IncremementsListComponent {
    increments: Array<IncrementInterface> = [];
    item: ItemInterface;

    initialCount: number = 10;
    showAll: boolean = false;

    constructor
    (
        public incrementProvider: IncrementProvider,
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        private events: Events
    ) {
        this.events.subscribe('increments:recalculate', () => {
            this.getIncrementsArray();
        });
    }

    ngOnInit() {
        // Using square branckets, because otherwise transpile throws warning
        this.item = this['item'];
        this.initialCount = this['initialCount'];

        // Using square branckets, because otherwise transpile throws warning
        this.incrementProvider.getItemIncrements(this.item.id).then((increments) => {
            this.getIncrementsArray();
        });
    }


    /**
     * private getIncrementsArray - Get increments array from storage
     *
     * @return {type}
     */
    private getIncrementsArray() {
        this.incrementProvider.getItemIncrements(this.item.id).then((increments) => {
            if (!this.showAll) {
                increments = increments.slice(-this.initialCount);
            }
            this.increments = increments;
        });
    }

    /**
     * Shows action sheet with increment options
     *
     * @param increment
     */
    showIncrementActions(increment) {
        let incrementActions = this.actionSheetCtrl.create({
            title: `Options`,
            buttons: [
                {
                    text: 'Delete',
                    icon: 'remove',
                    handler: () => {
                        this.showDeleteConfirm(increment);
                    }
                },
                {
                    text: 'Edit',
                    icon: 'create',
                    handler: () => {
                        this.openIncrementAddView(increment)
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close',
                    handler: () => {

                    }
                }
            ]
        });

        incrementActions.present();
    }

    /**
     * Show confirmation alert, when attempting to delete increment
     *
     * @param increment
     */
    showDeleteConfirm(increment) {
        let confirm = this.alertCtrl.create({
            title: `Delete?`,
            message: `Do you really want to delete this item?`,
            buttons: [
                {
                    text: 'No',
                    handler: () => {

                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.incrementProvider.deleteItemIncrement(this.item, increment.id).then((status) => {
                            if (status) {
                                // Need to refresh totals
                                this.events.publish('increments:recalculate');
                            }
                        });
                    }
                }
            ]
        });

        confirm.present();
    }

    /**
     * Opens Edit/Add increment view
     *
     * @param {{}} increment
     */
    openIncrementAddView(increment = {}) {
        let advancedIncrementModal = this.modalCtrl.create(AdvancedIncrementAddPage, {
            item: this.item,
            increment: increment
        });
        advancedIncrementModal.present();
    }

    /**
     * loadAllIncrements - show all increments
     *
     * @return {type}
     */
    loadAllIncrements() {
        this.showAll = true;

        this.events.publish('increments:recalculate');
    }
}
