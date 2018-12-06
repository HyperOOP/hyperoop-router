import { IRenderer, JSXFactory } from "hyperoop";
import { locationToString, locString } from "./locutils";
import { IToObject } from "./locutils";

/** Interface of the object that owns a `hyperoop.IRenderer` and can
 *  possibly handle location change events.
 */
export interface IRendererOwner {
    readonly onLocationChange?: (data: any) => void;
    readonly Renderer?: IRenderer;
}

export let jsxFactory: JSXFactory = null;

/** `Router` object that provides routing functionality to a `hyperoop` application */
export class Router {
    private rOwner: IRendererOwner;
    private loc:    string;

    /** Constructor initializes `Router` with `rOwner` which is usually `hyperoop.Actions`
     *  object and `jsxf` which is usually just `hyperoop.h`.
     */
    constructor(rOwner: IRendererOwner, jsxf: JSXFactory) {
        this.rOwner = rOwner;
        this.loc = locationToString(window.location);
        if (!jsxFactory) {
            jsxFactory = jsxf;
        }
        this.subscribe();
    }

    /** Go to a new location. Argument can be a `string` URL or `IToObject` */
    public go(t: string | IToObject) {
        const [to, state] = locString(t);
        if (to !== null && to !== locationToString(window.location)) {
            history.pushState(state, "", to);
        }
    }

    /** Stops a `Router` functionality, useful mainly for tests */
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
