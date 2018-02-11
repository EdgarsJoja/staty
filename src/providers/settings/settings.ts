import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * Settings interface
 */
export interface SettingsInterface {
    statistics_period: string,
    statistics_type: string,
    first_day_of_week: string,
    dark_mode: boolean
}

/**
 * Select option interface
 */
export interface SelectOptionInterface {
    value: string,
    label: string
}

export const SETTINGS_STORAGE_CODE = 'settings';

@Injectable()
export class SettingsProvider {
    constructor(private storage: Storage) {

    }

    /**
     * Get all settings.
     *
     * @returns {Promise<any>}
     */
    public getSettings() {
        return this.storage.get(SETTINGS_STORAGE_CODE);
    }

    /**
     * Save settings.
     *
     * @param {SettingsInterface} settings
     * @returns {Promise<any>}
     */
    public saveSettings(settings) {
        return this.storage.set(SETTINGS_STORAGE_CODE, settings);
    }

    /**
     * Return setting object with given values.
     *
     * @param {any} statisticsPeriod
     * @param {any} statisticsType
     * @param {any} firstDayOfWeek
     * @param {any} DarkMode
     * @returns {SettingsInterface}
     */
    public getDefinedSettings(statisticsPeriod, statisticsType, firstDayOfWeek, DarkMode) {
        return {
            statistics_period: statisticsPeriod,
            statistics_type: statisticsType,
            first_day_of_week: firstDayOfWeek,
            dark_mode: DarkMode
        }
    }

    /**
     * Get statistics period setting options.
     *
     * @returns {Array<SelectOptionInterface>}
     */
    public getStatisticsPeriodOptions() {
        return [
            { value: 'd', label: 'Day' },
            { value: 'w', label: 'Week' },
            { value: 'm', label: 'Month' },
            { value: 'q', label: 'Quarter' },
            { value: 'y', label: 'Year' }
        ];
    }

    /**
     * Get statistics type setting options.
     *
     * @returns {Array<SelectOptionInterface>}
     */
    public getStatisticsTypeOptions() {
        return [
            { value: 'line', label: 'Line' },
            { value: 'pie', label: 'Pie' },
            { value: 'bar', label: 'Bar' }
        ];
    }

    /**
     * Get first day of the week setting options.
     *
     * @returns {Array<SelectOptionInterface>}
     */
    public getFirstDayOfWeekOptions() {
        return [
            { value: 'monday', label: 'Monday' },
            { value: 'sunday', label: 'Sunday' },
        ];
    }

    /**
     * Check if two setting objects are equal.
     *
     * @param {SettingsInterface} a
     * @param {SettingsInterface} b
     * @returns {boolean}
     */
    public areEqual(a, b) {
        let aProps = Object.getOwnPropertyNames(a),
            bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        return true;
    }
}
