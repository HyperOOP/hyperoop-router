import { Component, VNode } from "hyperoop";
import { IMatch, parseRoute } from "./parseRoute";

export interface ITargetAttributes {
    match: IMatch;
}

export type TargetComponent = Component<ITargetAttributes>;
export type TargetNode = VNode<ITargetAttributes>;

export interface IRouteAttributes {
    path:      string;
    exact:     boolean;
    component: TargetComponent;
}

export let Route = (a: IRouteAttributes): TargetNode => {
    const  loc = window.location;
    const  match = parseRoute(a.path, loc.pathname, a.exact);
    return match && (a.component({match}, []) as TargetNode);
};
