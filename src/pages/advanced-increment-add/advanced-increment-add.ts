import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { IncrementInterface, IncrementProvider } from '../../providers/increment/increment';
import { ItemInterface } from '../../providers/item/item';
import { DEFAULT_UNITS } from "../../providers/units/units";

@IonicPage()
@Component({
    selector: 'page-advanced-increment-add',
    templateUrl: 'advanced-increment-add.html',
})
export class AdvancedIncrementAddPage {

    public incrementFormGroup: FormGroup;
    public increment: IncrementInterface;
    public defaultUnits = [];

    private item: ItemInterface;

    private showResetField = false;
    private showOtherUnitField = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private formBuilder: FormBuilder
    ) {
        this.item = this.navParams.get('item') || <ItemInterface>{};

        this.defaultUnits = DEFAULT_UNITS;
        console.log(this.defaultUnits);

        this.increment = <IncrementInterface>{
            id: this.item.id,
            value: parseFloat(this.item.increment),
            unit: this.item.unit,
            unit_other: this.item.unit_other,
            created_at: Date.now().toString()
        };
    }


    /**
     * processForm - Process/Save increment in storage
     *
     * @return {type}  description
     */
    processForm() {

    }
}
