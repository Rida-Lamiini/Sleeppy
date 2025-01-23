import { SessionBase, StorageKeys, SessionManager } from '../types.js';
/**
 * Provides a memory based session manager implementation for the browser.
 * @class MemoryStorage
 */
export declare class MemoryStorage<V extends string = StorageKeys> extends SessionBase<V> implements SessionManager<V> {
    private memCache;
    /**
     * Clears all items from session store.
     * @returns {void}
     */
    destroySession(): Promise<void>;
    /**
     * Sets the provided key-value store to the memory cache.
     * @param {string} itemKey
     * @param {unknown} itemValue
     * @returns {void}
     */
    setSessionItem(itemKey: V | StorageKeys, itemValue: unknown): Promise<void>;
    /**
     * Gets the item for the provided key from the memory cache.
     * @param {string} itemKey
     * @returns {unknown | null}
     */
    getSessionItem(itemKey: V | StorageKeys): Promise<unknown | null>;
    /**
     * Removes the item for the provided key from the memory cache.
     * @param {string} itemKey
     * @returns {void}
     */
    removeSessionItem(itemKey: V | StorageKeys): Promise<void>;
}
