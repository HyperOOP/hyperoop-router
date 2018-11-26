import { Component, IRenderer, VNode } from "hyperoop";

export interface IRendererOwner {
    readonly Callback?: <D = {}>(data: D) => void;
    readonly Renderer?: IRenderer;
}

export type Child = VNode | string | number | null;

type NameType<A> = Component<A> | string;
type Children = Array<Child | Child[]>;

export type JSXFactory =
    <A>(nodeName: NameType<A>, attributes?: A, ...children: Children) => VNode<A>;

export let jsxFactory: JSXFactory = null;

export class Router {
    private rOwner:   IRendererOwner;
    private pathname: string;

    constructor(rOwner: IRendererOwner, jsxf: JSXFactory) {
        this.rOwner = rOwner;
        this.pathname = window.location.pathname;
        if (!jsxFactory) {
            jsxFactory = jsxf;
        }
        this.subscribe();
    }

    public go(pathname: string) {
        history.pushState(null, "", pathname);
    }

    public stop() { /**/ }

    private wrapHistory(keys: string[]) {
        this.unwrapHistory = keys.reduce((next: () => void, key: string) => {
            const fn = history[key];
            history[key] = (data, title, url) => {
                fn.bind(history)(data, title, url);
                dispatchEvent(new CustomEvent("pushstate", { detail: data }));
            };

            return () => {
                history[key] = fn;
                if (next) { next(); }
            };
        }, null);
    }

    private unwrapHistory() { /**/ }

    private subscribe() {
        const self = this;

        const handleLocationChange = (e) => {
            if (self.pathname !== window.location.pathname) {
                if (self.rOwner.Callback) {
                    self.rOwner.Callback(e.state);
                } else {
                    self.rOwner.Renderer.render();
                }
                self.pathname = window.location.pathname;
            }
        };

        this.wrapHistory(["pushState", "replaceState"]);

        addEventListener("pushstate", handleLocationChange);
        addEventListener("popstate", handleLocationChange);

        this.stop = () => {
            removeEventListener("pushstate", handleLocationChange);
            removeEventListener("popstate", handleLocationChange);
            self.unwrapHistory();
        };
    }
}
