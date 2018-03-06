import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import moment from 'moment';

import { IncrementInterface } from '../../providers/increment/increment';
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
    public currentDateTime = '';

    private item: ItemInterface;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController
    ) {
        this.item = this.navParams.get('item') || <ItemInterface>{};

        this.defaultUnits = DEFAULT_UNITS;

        // To allow select only past dates
        this.currentDateTime = moment().format('YYYY-MM-DD');

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
