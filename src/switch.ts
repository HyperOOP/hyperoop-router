import { LazyVNode } from "hyperoop";

export const Switch = (a: {}, children: LazyVNode[]): LazyVNode => () => {
    for (const c of children) {
        const result = c && c();
        if (result) { return result; }
    }
    return null;
};
