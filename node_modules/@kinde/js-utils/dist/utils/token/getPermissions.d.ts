export type Permissions<T> = {
    orgCode: string | null;
    permissions: T[];
};
/**
 * Get all permissions
 * @returns { Promise<Permissions> }
 */
export declare const getPermissions: <T = string>() => Promise<Permissions<T>>;
