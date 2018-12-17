import { LazyVirtualNode } from "hyperoop";

/** Renders the first child `Route` that matches the location. */
export const Switch = (a: {}, children: LazyVirtualNode[]): LazyVirtualNode => () => {
    for (const c of children) {
        const result = c && c();
        if (result) { return result; }
    }
    return null;
};
