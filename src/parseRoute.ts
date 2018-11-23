export interface IMatch {
    isExact: boolean;
    path:    string;
    url:     string;
    params?:  {
        [K in string]: string
    };
}

const trimTrailingSlash = (x: string): string => x.replace(/(.*)\/$/, "$1");

const decodeParam = (val: string): string => {
    try {
        return decodeURIComponent(val);
    } catch {
        return val;
    }
};

export function parseRoute(path: string, url: string, exact: boolean): IMatch {
    if (path === url || !path) {
        return { isExact: path === url, path, url };
    }

    const paths = trimTrailingSlash(path).split("/");
    const urls = trimTrailingSlash(url).split("/");

    if (paths.length > urls.length || (exact && paths.length < urls.length)) {
        return null;
    }

    const result: IMatch = {
        isExact: false,
        params: {},
        path,
        url: "",
    };

    const len = paths.length;
    for (let i = 0; i < len; i++) {
        let [p, u] = [paths[i], urls[i]];
        if (":" === p[0]) {
            p = p.slice(1);
            result.params[p] = u = decodeParam(u);
        } else if (p !== u) {
            return null;
        }
        result.url += u + "/";
    }

    return result;
}
