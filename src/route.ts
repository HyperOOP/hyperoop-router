import { Component, LazyVNode } from "hyperoop";
import { IMatch, parseRoute } from "./parseRoute";

export interface ITargetAttributes {
    match: IMatch;
}

export type TargetComponent = Component<ITargetAttributes>;
export type TargetNode = LazyVNode<ITargetAttributes>;

export interface IRouteAttributes {
    path:      string;
    exact:     boolean;
    component: TargetComponent;
}

export let Route = (a: IRouteAttributes): TargetNode => () => {
    const loc = window.location;
    const match = parseRoute(a.path, loc.pathname, a.exact);
    if (!match) { return null; }
    const c = a.component({match}, []);
    if (typeof c === "function") { return c(); }
    return c;
};
