import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";

/**
* Increment interface
*/
export interface IncrementInterface {
    id: string,
    created_at: string,
    value: number,
    unit: string,
    unit_other: string
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
        if (increment && !increment.id) {
            // New increment
            return this.getItemIncrements(item.id).then((increments) => {
                let id = (increment && increment.id) ? increment.id : Date.now().toString(),
                    val = (increment && increment.value) ? increment.value : item.increment,
                    unit = (increment && increment.unit && item.unit !== 'other') ? increment.unit : (item.unit === 'other' ? item.unit_other : item.unit),
                    created_at = (increment && increment.created_at) ? increment.created_at : Date.now().toString();

                increments.push({
                    id: id,
                    value: val,
                    unit: unit,
                    created_at: created_at
                });

                return this.saveItemIncrements(item.id, increments).then((increments) => {
                    return true;
                });
            });
        }

        // Existing increment
        return this.updateItemIncrement(item, increment);
    }


    /**
     * public updateItemIncrement - Update existing item increment
     *
     * @param  {type} item                          item to which increment belongs
     * @param  {type} data = <IncrementInterface>{} new increment data
     * @return {type}
     */
    private updateItemIncrement(item, data = <IncrementInterface>{}) {
        return this.getItemIncrements(item.id).then((increments) => {
            const updateIndex = increments.findIndex(increment => increment.id === data.id);

            if (updateIndex !== -1) {
                data.unit = (data.unit && item.unit !== 'other') ? data.unit : (item.unit === 'other' ? data.unit_other : item.unit),

                increments[updateIndex] = Object.assign(increments[updateIndex], data);
                return this.saveItemIncrements(item.id, increments).then((increments) => {
                    return true;
                });
            }

            return false;
        });
    }


    /**
     * public deleteItemIncrement - Delete single item increment
     *
     * @param  {ItemInterface} item        Item whose increment will be deleted
     * @param  {string} incrementId Id for deleteable increment
     * @return {type}
     */
    public deleteItemIncrement(item, incrementId) {
        return this.getItemIncrements(item.id).then((increments) => {
            const deleteIndex = increments.findIndex(increment => increment.id === incrementId);

            if (deleteIndex !== -1) {
                increments.splice(deleteIndex, 1);
                return this.saveItemIncrements(item.id, increments).then((increments) => {
                    return true;
                });
            }

            return false;
        });
    }
}
