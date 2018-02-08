import {Injectable} from '@angular/core';

@Injectable()
export class ResetIntervalProvider {
    constructor() {}

    /**
     * Get starting date of an interval of specified type.
     *
     * @param {string} interval
     * @param {Date} date
     * @returns {number|null}
     */
    public getIntervalStartDate(interval, date = new Date()) {
        switch (interval) {
            case 'd':
                return this.getStartOfTheDay(date);
            case 'w':
                return this.getStartOfTheWeek(date);
            case 'm':
                return this.getStartOfTheMonth(date);
            case 'q':
                return this.getStartOfTheQuarter(date);
            case 'y':
                return this.getStartOfTheYear(date);
            default:
                return null;
        }
    }

    /**
     * Get end date of an interval of specified type.
     *
     * @param {string} interval
     * @param {Date} date
     * @returns {number|null}
     */
    public getIntervalEndDate(interval, date = new Date()) {
        switch (interval) {
            case 'd':
                return this.getEndOfTheDay(date);
            case 'w':
                return this.getEndOfTheWeek(date);
            case 'm':
                return this.getEndOfTheMonth(date);
            case 'q':
                return this.getEndOfTheQuarter(date);
            case 'y':
                return this.getEndOfTheYear(date);
            default:
                return null;
        }
    }

    /**
     * Get start of the day.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getStartOfTheDay(date) {
        return date.setHours(0,0,0,0);
    }

    /**
     * Get end of the day.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getEndOfTheDay(date) {
        return date.setHours(23,59,59,999);
    }

    /**
     * Get the first day of the week.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getStartOfTheWeek(date) {
        let day = date.getDay() || 7,
            diff = date.getDate() - day + 1;

        date = new Date(date.setDate(diff));

        return this.getStartOfTheDay(date);
    }

    /**
     * Get the last day of the week.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getEndOfTheWeek(date) {
        let day = date.getDay() || 7,
            diff = date.getDate() - day + 7;

        date = new Date(date.setDate(diff));

        return this.getEndOfTheDay(date);
    }

    /**
     * Get the first day of the month.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getStartOfTheMonth(date) {
        date = new Date(date.setDate(1));

        return this.getStartOfTheDay(date);
    }

    /**
     * Get the last day of the month.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getEndOfTheMonth(date) {
        date = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return this.getEndOfTheDay(date);
    }

    /**
     * Get the first day of the quarter.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getStartOfTheQuarter(date) {
        let quarter = Math.floor((date.getMonth() + 3) / 3);

        date = new Date(date.getFullYear(), (quarter * 3) - 3, 1);

        return this.getStartOfTheDay(date);
    }

    /**
     * Get the last day of the quarter.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getEndOfTheQuarter(date) {
        let quarter = Math.floor((date.getMonth() + 3) / 3);

        date = new Date(date.getFullYear(), quarter * 3, 0);

        return this.getEndOfTheDay(date);
    }

    /**
     * Get the first day of the year.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getStartOfTheYear(date) {
        date = new Date(date.setMonth(0));
        date = new Date(date.setDate(1));

        return this.getStartOfTheDay(date);
    }

    /**
     * Get the last day of the year.
     *
     * @param {Date} date
     * @returns {number}
     */
    private getEndOfTheYear(date) {
        date = new Date(date.setMonth(11));
        date = new Date(date.setDate(31));

        return this.getEndOfTheDay(date);
    }
}
