import { VNode } from "hyperoop";

export const Switch = (a: {}, children: VNode[]): VNode => {
    for (const c of children) {
        if (c) { return c; }
    }
    return null;
};
