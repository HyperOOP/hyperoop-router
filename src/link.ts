import { IVirtualNode } from "hyperoop";
import { IToObject, locationToString, locString } from "./locutils";
import { jsxFactory as h } from "./router";

interface ILocated {
    protocol: string;
    hostname: string;
    port?:    string;
}

const origin = (loc: ILocated) =>
    loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");

const isExternal = (el: ILocated): boolean => el && origin(window.location) !== origin(el);

/** Attributes for component `Link` */
export interface ILinkAttributes {
    /** Where to go? Can be a `string` URL or `IToObject` */
    to:       string | IToObject;
    /** Additional event handler for clicking mouse. */
    onclick?: (e: MouseEvent) => void;
}

/** `Link` component that provides application navigation */
export const Link = (a: ILinkAttributes, children: Array<IVirtualNode | string>) =>
    h("a", {
        ...a,
        href: locString(a.to)[0],
        onclick(e: MouseEvent) {
            const loc = window.location;

            if (a.onclick) { a.onclick(e); }

            if (e.defaultPrevented || e.button !== 0 ||
                e.altKey || e.metaKey || e.ctrlKey || e.shiftKey ||
                isExternal(e.currentTarget as any as ILocated)) { return; }

            if (a.to) {
                e.preventDefault();
                const [to, state] = locString(a.to);
                if (to !== null && to !== locationToString(window.location)) {
                    history.pushState(state, "", to);
                }
            }
        },
        to: undefined,
    }, children);
