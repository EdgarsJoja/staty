import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";

/**
* Increment interface
*/
export interface IncrementInterface {
    id: string,
    created_at: String,
    value: number,
    unit: string
}

export const INCREMENT_STORAGE_CODE_PREFIX = 'item_increment_';

@Injectable()
export class IncrementProvider {

    constructor(private storage: Storage) {

    }

    /**
    * Generates storage key for each item increment values
    *
    * @param itemId
    * @returns {string}
    */
    private getItemIncrementStorageKey(itemId) {
        return `${INCREMENT_STORAGE_CODE_PREFIX}${itemId}`;
    }

    /**
    * Save item increment data into storage
    *
    * @param itemId
    * @param increments
    * @returns {Promise<any>}
    */
    public saveItemIncrements(itemId, increments) {
        return this.storage.set(this.getItemIncrementStorageKey(itemId), increments);
    }

    /**
    * Get item increment records
    *
    * @param itemId
    * @returns {Promise<any>}
    */
    public getItemIncrements(itemId) {
        return this.storage.get(this.getItemIncrementStorageKey(itemId));
    }

    /**
    * Delete all item increments from storage
    *
    * @param itemId
    * @returns {Promise<any>}
    */
    public deleteItemIncrements(itemId) {
        return this.storage.set(this.getItemIncrementStorageKey(itemId), []);
    }

    /**
    * Delete all increments from storage
    *
    * @returns {Promise<any>}
    */
    public deleteAllIncrements() {
        let self = this;
        return self.storage.keys().then(keys => {
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].indexOf(`${INCREMENT_STORAGE_CODE_PREFIX}`) !== -1) {
                    self.storage.set(keys[i], []);
                }
            }
        });
    }

    /**
    * Check if customer has added any increments
    *
    * @returns {Promise<boolean>}
    */
    public hasAnyIncrements() {
        let hasIncrements = false;

        return this.storage.forEach((value, key) => {
            if (key.indexOf(`${INCREMENT_STORAGE_CODE_PREFIX}`) !== -1 && value && value.length) {
                hasIncrements = true;
            }
        }).then(() => {
            return hasIncrements;
        });
    }

    /**
    * Add new item increment.
    *
    * @param item
    * @param {IncrementInterface} increment
    * @returns {Promise<any>}
    */
    addItemIncrement(item, increment = <IncrementInterface>{}) {
        return this.getItemIncrements(item.id).then((increments) => {
            let val = (increment && increment.value) ? increment.value : item.increment,
                unit = (increment && increment.unit) ? increment.unit : (item.unit === 'other' ? item.unit_other : item.unit),
                created_at = (increment && increment.created_at) ? increment.created_at : Date.now().toString();

            increments.push({
                id: item.id,
                value: val,
                unit: unit,
                created_at: created_at
            });

            return this.saveItemIncrements(item.id, increments).then((increments) => {
                return true;
            });
        });
    }
}
