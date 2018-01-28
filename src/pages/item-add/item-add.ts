import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

    constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public storage: Storage) {
        this.itemsStorageCode = 'items';
        this.showResetField = false;
        this.showOtherUnitField = false;
        this.itemAddForm = formBuilder.group({
            title: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
            unit: ['', Validators.compose([Validators.required])],
            unit_other: [''],
            increment: ['', Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*')])],
            reset_enabled: [false],
            reset: ['']
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

                data.id = newId;
                data.created_at = newId;
                items[newId] = data;
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
