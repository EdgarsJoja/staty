import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {IncrementProvider} from "../increment/increment";

/**
 * Item interface
 */
export interface ItemInterface {
    id: string,
    created_at: Date,
    increment: string,
    reset: string,
    reset_enabled: boolean,
    title: string,
    unit: string,
    unit_other: string
}

export const ITEMS_STORAGE_CODE = 'items';

@Injectable()
export class ItemProvider {
    constructor(private storage: Storage, private incrementProvider: IncrementProvider) {

    }

    /**
     * Get's item data from storage by it's ID.
     *
     * @param id
     * @returns {{}}
     */
    public getItem(id) {
        return this.storage.get(ITEMS_STORAGE_CODE).then((items) => {
            let item;

            // Find existing item
            let itemIdx = items.findIndex((item) => item.id === id);

            // If found, add edited data
            if (itemIdx !== -1) {
                item = items[itemIdx];
            }

            return item;
        });
    }

    /**
     * Gets all items from storage as storage??
     *
     * @returns {Promise<any>}
     */
    public getAllItems() {
        return this.storage.get(ITEMS_STORAGE_CODE);
    }

    /**
     * Save items in storage
     *
     * @param items
     */
    public saveItems(items) {
        return this.storage.set(ITEMS_STORAGE_CODE, items);
    }

    /**
     * Delete item by id from storage
     *
     * @param id
     */
    public deleteItem(id) {
        return this.getAllItems().then((items) => {
            items.splice(items.findIndex((item) => item.id === id), 1);

            return this.saveItems(items).then(() => {
                // Delete corresponding increment values as well
                this.incrementProvider.deleteItemIncrements(id);
                return id;
            }).catch(() => {
                return '';
            });
        }).catch(() => {
            return '';
        });
    }

    /**
     * Add single item
     *
     * @param data
     * @returns {Promise<any>}
     */
    public saveItem(data) {
        return this.getAllItems().then((items) => {
            items = items || [];
            let idx = items.findIndex((item) => item.id === data.id);

            if (idx === -1) {
                this.incrementProvider.saveItemIncrements(data.id, []);
                items.push(data);
            } else {
                items[idx] = Object.assign(items[idx], data);
            }

            return this.saveItems(items);
        });
    }
}
