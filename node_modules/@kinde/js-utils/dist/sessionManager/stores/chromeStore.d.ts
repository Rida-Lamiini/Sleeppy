import { SessionBase, StorageKeys, SessionManager } from '../types.js';
/**
 * Provides a chrome.store.local based session manager implementation for the browser.
 * @class ChromeStore
 */
export declare class ChromeStore<V extends string = StorageKeys> extends SessionBase<V> implements SessionManager<V> {
    /**
     * Clears all items from session store.
     * @returns {void}
     */
    destroySession(): Promise<void>;
    /**
     * Sets the provided key-value store to the chrome.store.local.
     * @param {string} itemKey
     * @param {unknown} itemValue
     * @returns {void}
     */
    setSessionItem(itemKey: V | StorageKeys, itemValue: unknown): Promise<void>;
    /**
     * Gets the item for the provided key from the chrome.store.local cache.
     * @param {string} itemKey
     * @returns {unknown | null}
     */
    getSessionItem(itemKey: V | StorageKeys): Promise<unknown | null>;
    /**
     * Removes the item for the provided key from the chrome.store.local cache.
     * @param {string} itemKey
     * @returns {void}
     */
    removeSessionItem(itemKey: V | StorageKeys): Promise<void>;
}
