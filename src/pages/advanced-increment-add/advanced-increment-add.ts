import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';

import moment from 'moment';

import { IncrementInterface, IncrementProvider } from '../../providers/increment/increment';
import { ItemInterface } from '../../providers/item/item';
import { DEFAULT_UNITS } from "../../providers/units/units";

@IonicPage()
@Component({
    selector: 'page-advanced-increment-add',
    templateUrl: 'advanced-increment-add.html',
})
export class AdvancedIncrementAddPage {

    public increment: IncrementInterface;
    public defaultUnits = [];
    public currentDateTime = '';

    private item: ItemInterface;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private incrementProvider: IncrementProvider,
        private events: Events
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
        this.incrementProvider.addItemIncrement(this.item, this.increment).then((status) => {
            if (status) {
                // Need to refresh totals
                this.events.publish('increments:recalculate');
                this.viewCtrl.dismiss();
            } else {
                // @todo: Add error handling
            }
        });
    }


    /**
     * public toUnix - Convert date to unix timestamp
     *
     * @param  {type} date
     * @return {type}
     */
    toUnix(date) {
        this.increment.created_at = moment(date).unix().toString();
    }
}
