import {
    IToObject,
    ILinkAttributes,
    Link,
    IRedirectAttributes,
    Redirect,
    IMatch,
    IRouteAttributes,
    ITargetAttributes,
    Route,
    TargetComponent,
    IRendererOwner,
    Router,
    Switch } from "router";

import * as ui from "hyperoop";

export const toobj1: IToObject = { state: 1 };
export const toobj2: IToObject = { hash: "#A", state: 1 };
export const toobj3: IToObject = { pathname: "A/B", state: 1 };
export const toobj4: IToObject = { search: "?A=B", state: 1 };
export const lattr1: ILinkAttributes = { to: "/x/y" };
export const lattr2: ILinkAttributes = { to: toobj3 };
export const lattr3: ILinkAttributes = { to: toobj3, onclick: ()=>{} };
export const link: ui.VNode<ILinkAttributes> = Link(lattr3, []);
export const rattr1: IRedirectAttributes = { to: "/a/b"};
export const rattr2: IRedirectAttributes = { from: "x", to: "/a/b"};
export const redirect: string = Redirect(rattr2);
export const match1: IMatch = { isExact: true, path: "a/b", url: "a/b" };
export const match2: IMatch = { isExact: true, path: "a/b", url: "a/b", params: { a: "1", b: "" } };
export const tattr: ITargetAttributes = { match: match2 };
export const tcomp: TargetComponent = (a: ITargetAttributes) => (<div/>);
export const roattr1: IRouteAttributes = { path: "a/b", exact: true, component: tcomp};
export const tnode: ui.LazyVNode = Route(roattr1, []);
class Actions extends ui.Actions<{}> { onLocationChange(data: any){} }
export const rown1: IRendererOwner = new ui.Actions<{}>({}, 10);
export const rown2: IRendererOwner = new Actions({}, 10);
export const router1: Router = new Router(rown1, ui.h);
export const router2: Router = new Router(rown2, ui.h);
export const lnode1: ui.LazyVNode = Switch({}, [()=>link]);