import { Injectable } from '@angular/core';

import moment from 'moment';

@Injectable()
export class DateProvider {

    constructor() {

    }

    /**
    * toUnix - convert date to unix timestamp in miliseconds, to match Date.now()
    *
    * @param  {type} date
    * @return {type}
    */
    toUnix(date) {
        return moment(date).valueOf().toString();
    }


    /**
     * getFormattedTimePassed - Get timepassed in readable format
     *
     * @param  {string} date
     * @return {string}
     */
    getFormattedTimePassed(date) {
        date = moment(parseInt(date));

        if (date.isValid()) {
            return date.fromNow();
        }

        return '';
    }
}
