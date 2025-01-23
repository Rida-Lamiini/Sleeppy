import { SessionBase, StorageKeys, SessionManager } from '../types.js';
/**
 * Provides a localStorage based session manager implementation for the browser.
 * @class LocalStorage
 */
export declare class LocalStorage<V extends string = StorageKeys> extends SessionBase<V> implements SessionManager<V> {
    constructor();
    private internalItems;
    /**
     * Clears all items from session store.
     * @returns {void}
     */
    destroySession(): Promise<void>;
    /**
     * Sets the provided key-value store to the localStorage cache.
     * @param {V} itemKey
     * @param {unknown} itemValue
     * @returns {void}
     */
    setSessionItem(itemKey: V | StorageKeys, itemValue: unknown): Promise<void>;
    /**
     * Gets the item for the provided key from the localStorage cache.
     * @param {string} itemKey
     * @returns {unknown | null}
     */
    getSessionItem(itemKey: V | StorageKeys): Promise<unknown | null>;
    /**
     * Removes the item for the provided key from the localStorage cache.
     * @param {V} itemKey
     * @returns {void}
     */
    removeSessionItem(itemKey: V | StorageKeys): Promise<void>;
}
