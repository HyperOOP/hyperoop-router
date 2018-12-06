import { LazyVNode } from "hyperoop";

/** Renders the first child `Route` that matches the location. */
export const Switch = (a: {}, children: LazyVNode[]): LazyVNode => () => {
    for (const c of children) {
        const result = c && c();
        if (result) { return result; }
    }
    return null;
};
