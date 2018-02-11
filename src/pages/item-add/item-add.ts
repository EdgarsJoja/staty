import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ItemInterface, ItemProvider} from "../../providers/item/item";

@Component({
    selector: 'page-item-add',
    templateUrl: 'item-add.html'
})
export class ItemAddPage {
    showResetField: boolean;
    showOtherUnitField: boolean;
    itemAddForm: FormGroup;
    unitOptions: Array<{}>;
    resetOptions: Array<{}>;
    item: ItemInterface;

    constructor(
        public navCtrl: NavController,
        public formBuilder: FormBuilder,
        public navParams: NavParams,
        private itemProvider: ItemProvider
    ) {
        this.item = this.navParams.get('item') || {};

        this.showResetField = this.item.reset_enabled === true;
        this.showOtherUnitField = this.item.unit === 'other';

        if (!this.item.unit) {
            this.item.unit = '';
        }

        this.itemAddForm = formBuilder.group({
            title: [this.item.title, Validators.compose([Validators.required, Validators.maxLength(30)])],
            unit: [this.item.unit],
            unit_other: [this.item.unit_other],
            increment: [this.item.increment, Validators.compose([Validators.required, Validators.pattern('^([0-9]+[.])?[0-9]+')])],
            reset_enabled: [this.item.reset_enabled],
            reset: [this.item.reset],
            id: [this.item.id],
            created_at: [this.item.created_at],
        });
        this.unitOptions = [
            {'value': '', 'label': 'None'},
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
            {'value': 'q', 'label': 'Quarterly'},
            {'value': 'y', 'label': 'Yearly'},
        ];
    }

    submitItemAddForm(data) {
        if (this.itemAddForm.valid) {
            if (!data.reset_enabled || !data.reset) {
                data.reset_enabled = false;
                data.reset = '';
            }

            if (!this.item.id) {
                let newId = Date.now();
                data.id = newId.toString();
                data.created_at = newId;
            }

            this.itemProvider.saveItem(data).then((status) => {
                if (status) {
                    // Go back to root (using "goToRoot" instead of "pop" so that the list page gets refreshed).
                    this.navCtrl.goToRoot({
                        updateUrl: false,
                        isNavRoot: true
                    });
                }
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
