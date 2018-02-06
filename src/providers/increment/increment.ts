import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";

/**
 * Increment interface
 */
export interface IncrementInterface {
    id: string,
    created_at: Date,
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
        return this.storage.remove(this.getItemIncrementStorageKey(itemId));
    }
}
