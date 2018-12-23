import {
    ILinkAttributes,
    IMatch,
    IRedirectAttributes,
    IRendererOwner,
    IRouteAttributes,
    ITargetAttributes,
    IToObject,
    Link,
    Redirect,
    Route,
    Router,
    Switch,
    TargetComponent} from "router";

import * as ui from "hyperoop";

export const toobj1: IToObject = { state: 1 };
export const toobj2: IToObject = { hash: "#A", state: 1 };
export const toobj3: IToObject = { pathname: "A/B", state: 1 };
export const toobj4: IToObject = { search: "?A=B", state: 1 };
export const lattr1: ILinkAttributes = { to: "/x/y" };
export const lattr2: ILinkAttributes = { to: toobj3 };
export const lattr3: ILinkAttributes = { to: toobj3, onclick: () => {} };
export const link: ui.IVirtualNode<ILinkAttributes> = Link(lattr3, []);
export const rattr1: IRedirectAttributes = { to: "/a/b"};
export const rattr2: IRedirectAttributes = { from: "x", to: "/a/b"};
export const redirect: string = Redirect(rattr2);
export const match1: IMatch = { isExact: true, path: "a/b", url: "a/b" };
export const match2: IMatch = { isExact: true, path: "a/b", url: "a/b", params: { a: "1", b: "" } };
export const tattr: ITargetAttributes = { match: match2 };
export const tcomp: TargetComponent = (a: ITargetAttributes) => (<div/>);
export const roattr1: IRouteAttributes = { path: "a/b", exact: true, component: tcomp};
export const tnode: ui.LazyVirtualNode = Route(roattr1, []);
class Actions extends ui.Actions<{}> { public onLocationChange(data: any) {/**/} }
export const rown1: IRendererOwner = new ui.Actions<{}>({});
export const rown2: IRendererOwner = new Actions({});
export const router1: Router = new Router(rown1, ui.h);
export const router2: Router = new Router(rown2, ui.h);
export const lnode1: ui.LazyVirtualNode = Switch({}, [() => link]);
