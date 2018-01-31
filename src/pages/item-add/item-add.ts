import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Item interface
 */
interface Item {
    id: Date,
    created_at: Date,
    increment: string,
    reset: string,
    reset_enabled: boolean,
    title: string,
    unit: string,
    unit_other: string
}

@Component({
    selector: 'page-item-add',
    templateUrl: 'item-add.html'
})
export class ItemAddPage {
    itemsStorageCode: string;
    showResetField: boolean;
    showOtherUnitField: boolean;
    itemAddForm: FormGroup;
    unitOptions: Array<{}>;
    resetOptions: Array<{}>;
    item: Item;

    constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public storage: Storage, public navParams: NavParams) {
        this.itemsStorageCode = 'items';
        this.showResetField = false;
        this.showOtherUnitField = false;
        this.item = this.navParams.get('item') || {};

        this.itemAddForm = formBuilder.group({
            title: [this.item.title, Validators.compose([Validators.required, Validators.maxLength(30)])],
            unit: [this.item.unit, Validators.compose([Validators.required])],
            unit_other: [this.item.unit_other],
            increment: [this.item.increment, Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*')])],
            reset_enabled: [this.item.reset_enabled],
            reset: [this.item.reset],
            id: [this.item.id],
            created_at: [this.item.created_at],
        });
        this.unitOptions = [
            {'value': 'kg', 'label': 'Kg'},
            {'value': 'lbs', 'label': 'Lbs'},
            {'value': 'km', 'label': 'Km'},
            {'value': 'miles', 'label': 'Miles'},
            {'value': 'other', 'label': 'Other'},
        ];
        this.resetOptions = [
            {'value': 'd', 'label': 'Daily'},
            {'value': 'w', 'label': 'Weekly'},
            {'value': 'm', 'label': 'Monthly'},
            {'value': 'y', 'label': 'Yearly'},
        ];
    }

    submitItemAddForm(data) {
        if (this.itemAddForm.valid) {
            if (!data.reset_enabled || !data.reset) {
                data.reset_enabled = false;
                data.reset = '';
            }

            if (data.unit === 'other') {
                data.unit = data.unit_other;
                delete data.unit_other;
            }

            this.storage.get(this.itemsStorageCode).then((items) => {
                items = items || {};
                let newId = null;

                // Use timestamp as ID. If item with this ID already exists - re-generate.
                do {
                    newId = Date.now();
                } while (items.hasOwnProperty(newId));

                newId = Date.now();
                // Find existing item
                let itemIdx = items.findIndex((item) => item.id === this.item.id);

                // If found, add edited data
                if (itemIdx !== -1) {
                    items[itemIdx] = Object.assign(items[itemIdx], data);
                } else {
                    data.id = newId;
                    data.created_at = newId;
                    items.push(data);
                }

                this.storage.set(this.itemsStorageCode, items);

                // Go back to root (using "goToRoot" instead of "pop" so that the list page gets refreshed).
                this.navCtrl.goToRoot({
                    updateUrl: false,
                    isNavRoot: true
                });
            });
        }
    }

    toggleOtherUnitField(value) {
        if (value === 'other') {
            this.itemAddForm.controls.unit_other.setValidators(Validators.compose([Validators.required, Validators.maxLength(10)]));
            this.showOtherUnitField = true;
        } else {
            this.itemAddForm.controls.unit_other.clearValidators();
            this.itemAddForm.controls.unit_other.reset();
            this.showOtherUnitField = false;
        }
    }

    toggleResetField() {
        this.showResetField = !this.showResetField;
    }
}
