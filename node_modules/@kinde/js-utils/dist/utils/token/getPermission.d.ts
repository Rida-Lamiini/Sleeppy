export type PermissionAccess = {
    permissionKey: string;
    orgCode: string | null;
    isGranted: boolean;
};
/**
 *
 * @param permissionKey gets the value of a permission
 * @returns { PermissionAccess }
 */
export declare const getPermission: <T = string>(permissionKey: T) => Promise<PermissionAccess>;
