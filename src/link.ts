import { VNode } from "hyperoop";
import {trimTrailingSlash} from "./parseRoute";
import {jsxFactory as h} from "./router";

interface ILocated {
    protocol: string;
    hostname: string;
    port?:    string;
}

const origin = (loc: ILocated) =>
    loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");

const isExternal = (el: ILocated): boolean => el && origin(window.location) !== origin(el);

export interface IToObject {
    pathname: string;
    search:   string;
    hash:     string;
    state:    any;
}

export interface ILinkAttributes {
    to:       string | IToObject;
    onclick?: (e: MouseEvent) => void;
}

const parseLocation = (to: string | IToObject): [string, any] => {
    if (!to) { return ["#", null]; }
    if (typeof to === "string") { return [to, null]; }
    const pathname = trimTrailingSlash(to.pathname);
    return ["" +
        (pathname ? pathname : "") +
        (to.search  ? (to.search[0] === "?" ? to.search : "?" + to.search) : "") +
        (to.hash ? (to.hash[0] === "#" ? to.hash : "#" + to.hash) : ""), to.state];
};

export let Link = (a: ILinkAttributes, children: Array<VNode | string>) =>
    h("a", {
        ...a,
        href: parseLocation(a.to)[0],
        onclick(e: MouseEvent) {
            const loc = window.location;

            if (a.onclick) { a.onclick(e); }

            if (e.defaultPrevented || e.button !== 0 ||
                e.altKey || e.metaKey || e.ctrlKey || e.shiftKey ||
                isExternal(e.currentTarget as any as ILocated)) { return; }

            if (a.to) {
                e.preventDefault();
                const [to, state] = parseLocation(a.to);
                if (to !== null && to !== loc.pathname) {
                    history.pushState(state, "", to);
                }
            }
        },
        to: undefined,
    }, children);
