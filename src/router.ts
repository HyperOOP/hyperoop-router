import { IRenderer, JSXFactory } from "hyperoop";
import { locationToString, locString } from "./locutils";
import { IToObject } from "./locutils";

export interface IRendererOwner {
    readonly onLocationChange?: (data: any) => void;
    readonly Renderer?: IRenderer;
}

export let jsxFactory: JSXFactory = null;

export class Router {
    private rOwner: IRendererOwner;
    private loc:    string;

    constructor(rOwner: IRendererOwner, jsxf: JSXFactory) {
        this.rOwner = rOwner;
        this.loc = locationToString(window.location);
        if (!jsxFactory) {
            jsxFactory = jsxf;
        }
        this.subscribe();
    }

    public go(t: string | IToObject) {
        const [to, state] = locString(t);
        if (to !== null && to !== locationToString(window.location)) {
            history.pushState(state, "", to);
        }
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
            const state = "state" in e ? e.state : e.detail;
            const loc = locationToString(window.location);
            if (self.loc !== loc) {
                if (self.rOwner.onLocationChange) {
                    self.rOwner.onLocationChange(state);
                } else {
                    self.rOwner.Renderer.render();
                }
                self.loc = loc;
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
