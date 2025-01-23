export type UserProfile = {
    id: string;
    givenName?: string;
    familyName?: string;
    email?: string;
    picture?: string;
};
export declare const getUserProfile: <T>() => Promise<(UserProfile & T) | null>;
