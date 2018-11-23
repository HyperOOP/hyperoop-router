import { VNode } from "hyperoop";
import {jsxFactory as h} from "./router";

interface ILocated {
    protocol: string;
    hostname: string;
    port?:    string;
}

const origin = (loc: ILocated) =>
    loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");

const isExternal = (el: ILocated): boolean => el && origin(window.location) !== origin(el);

export interface ILinkAttributes {
    to:       string;
    onclick?: (e: MouseEvent) => void;
}

export let Link = (a: ILinkAttributes, children: Array<VNode | string>) =>
    h("a", {
        href: a.to,
        onclick(e: MouseEvent) {
            const loc = window.location;

            if (a.onclick) { a.onclick(e); }

            if (e.defaultPrevented || e.button !== 0 ||
                e.altKey || e.metaKey || e.ctrlKey || e.shiftKey ||
                isExternal(e.currentTarget as any as ILocated)) { return; }

            e.preventDefault();
            if (a.to !== loc.pathname) {
                history.pushState(null, "", a.to);
            }
        },
    }, children);
