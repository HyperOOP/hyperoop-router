import { trimTrailingSlash } from "./parseRoute";

/** Possible attribute for `Link` navigation */
export interface IToObject {
    /**  The path to link to, for example `path/to/store` */
    pathname?: string;
    /** Query parameters, for example `?model=new&price=low` */
    search?:   string;
    /** A hash to put in the URL, for example `#product-description` */
    hash?:     string;
    /** Application state corresponding to this new location */
    state:     any;
}

export const locationToString = (loc: Location): string => loc.pathname + loc.search + loc.hash;

export const locString = (to: string | IToObject): [string, any] => {
    if (!to) { return ["#", null]; }
    if (typeof to === "string") { return [to, null]; }
    return ["" +
        (to.pathname ? trimTrailingSlash(to.pathname) : "") +
        (to.search  ? (to.search[0] === "?" ? to.search : "?" + to.search) : "") +
        (to.hash ? (to.hash[0] === "#" ? to.hash : "#" + to.hash) : ""), to.state];
};
