export interface IsAuthenticatedPropsWithRefreshToken {
    useRefreshToken?: true;
    domain: string;
    clientId: string;
}
export interface IsAuthenticatedPropsWithoutRefreshToken {
    useRefreshToken?: false;
    domain?: never;
    clientId?: never;
}
type IsAuthenticatedProps = IsAuthenticatedPropsWithRefreshToken | IsAuthenticatedPropsWithoutRefreshToken;
/**
 * check if the user is authenticated with option to refresh the token
 * @returns { Promise<boolean> }
 */
export declare const isAuthenticated: (props?: IsAuthenticatedProps) => Promise<boolean>;
export {};
