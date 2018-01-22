import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'page-item-add',
    templateUrl: 'item-add.html'
})
export class ItemAddPage {
    showResetField: boolean;
    showOtherUnitField: boolean;
    itemAddForm: FormGroup;
    unitOptions: Array<{}>;

    constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private storage: Storage) {
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

            this.storage.get('items').then((value) => {
                let items = value || [];

                items.push(data);
                this.storage.set('items', items);

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
