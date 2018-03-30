import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';

import moment from 'moment';

import { IncrementInterface, IncrementProvider } from '../../providers/increment/increment';
import { ItemInterface } from '../../providers/item/item';
import { DEFAULT_UNITS, UnitsProvider } from "../../providers/units/units";
import { DateProvider } from '../../providers/date/date';

@IonicPage()
@Component({
    selector: 'page-advanced-increment-add',
    templateUrl: 'advanced-increment-add.html',
    providers: [UnitsProvider]
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
        public dateProvider: DateProvider,
        public unitsProvider: UnitsProvider,
        private incrementProvider: IncrementProvider,
        private events: Events
    ) {
        this.item = this.navParams.get('item') || <ItemInterface>{};
        this.increment = this.navParams.get('increment') || <IncrementInterface>{};

        this.defaultUnits = DEFAULT_UNITS;

        // To allow select only past dates
        this.currentDateTime = moment().format('YYYY-MM-DD');

        let unit = this.increment.unit || this.item.unit;
        const currentTimestamp = Date.now().toString();

        this.increment = <IncrementInterface>{
            id: this.increment.id || null,
            value: this.increment.value || parseFloat(this.item.increment),
            unit: this.unitsProvider.isDefaultUnit(unit) ? unit : 'other',
            unit_other: this.item.unit_other,
            created_at: this.increment.created_at || currentTimestamp
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
     * public formatAndSetCreatedAt - Convert date to unix timestamp
     *
     * @param  {type} date
     * @return {type}
     */
    formatAndSetCreatedAt(date) {
        this.increment.created_at = this.dateProvider.toUnix(date);
    }
}
