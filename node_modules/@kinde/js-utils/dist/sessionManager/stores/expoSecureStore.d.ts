import { SessionBase, StorageKeys } from '../types.js';
/**
 * Provides a expo local store based session manager implementation for the browser.
 * @class ExpoSecureStore
 */
export declare class ExpoSecureStore<V extends string = StorageKeys> extends SessionBase<V> {
    constructor();
    private loadExpoStore;
    /**
     * Clears all items from session store.
     * @returns {void}
     */
    destroySession(): Promise<void>;
    /**
     * Sets the provided key-value store to ExpoSecureStore.
     * @param {string} itemKey
     * @param {unknown} itemValue
     * @returns {void}
     */
    setSessionItem(itemKey: V | StorageKeys, itemValue: unknown): Promise<void>;
    /**
     * Gets the item for the provided key from the ExpoSecureStore.
     * @param {string} itemKey
     * @returns {unknown | null}
     */
    getSessionItem(itemKey: V | StorageKeys): Promise<unknown | null>;
    /**
     * Removes the item for the provided key from the ExpoSecureStore.
     * @param {string} itemKey
     * @returns {void}
     */
    removeSessionItem(itemKey: V | StorageKeys): Promise<void>;
}
