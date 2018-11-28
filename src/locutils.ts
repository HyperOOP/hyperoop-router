import {trimTrailingSlash} from "./parseRoute";

export interface IToObject {
    pathname?: string;
    search?:   string;
    hash?:     string;
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
