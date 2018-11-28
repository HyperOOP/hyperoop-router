const { Router, Route } = require("./dist")
const ui = require("hyperoop");

class App extends ui.Actions {
    constructor() {
        super({});
        this.router = new Router(this, ui.h);
    }
}

let app = new App();

test("Route is a lazy component", () => {
    expect(Route(null, [])).toBeInstanceOf(Function)
})
  
test("Route returns falsy if it doesn't match to current location", () => {
    app.router.go("/articles");
    const component = jest.fn()
    expect(Route({ path: "/users", component }, [])()).toBeFalsy();
    expect(component).not.toBeCalled();
});

test("Route accepts lazy component", () => {
    app.router.go("/users");
    const fn = jest.fn();
    const component = () => fn;
    Route({ path: "/users", component }, [])();
    expect(fn).toBeCalled();
});

test("Route returns result of component prop if it exactly matches to current location", () => {
    expect.assertions(3);
    app.router.go("/users");

    const component = jest.fn(({ match }) => {
        expect(match.isExact).toBe(true)
            return "result"
    });

    expect(Route({ path: "/users", component }, [])()).toEqual(
        "result"
    );

    expect(component).toBeCalled();
});

test("Route returns result of component prop if it matches to current location", () => {
    expect.assertions(4);
    app.router.go("/users/1");
    const component = jest.fn(({ match }) => {
        expect(match.isExact).toBe(false)
        expect(match.params).toEqual({ id: "1" })
        return "result"
    });

    expect(Route({ path: "/users/:id", component }, [])()).toEqual(
        "result"
    );

    expect(component).toBeCalled();
});

test("Route without path prop matches to every location", () => {
    const component = () => true;
    app.router.go("/");
    expect(Route({ component }, [])()).toBe(true);
    app.router.go("/users");
    expect(Route({ component }, [])()).toBe(true);
});

test("Route decodes encoded URI", () => {
    expect.assertions(1)
    app.router.go("/foo/caf%C3%A9/bar/baz");
    const component = ({ match }) => {
        expect(match.params).toEqual({ foo: "café", bar: "baz" })
    }
    Route({ path: "/foo/:foo/bar/:bar", component }, [])();
})

test("Route ignores url params containing invalid character sequences", () => {
    expect.assertions(3)
    const invalid = "%E0%A4%A"
    expect(() => decodeURI(invalid)).toThrow(URIError)
    app.router.go(`/foo/${invalid}/bar/baz`);
    const component = ({ match }) => {
        expect(match.params).toEqual({ foo: invalid, bar: "baz" })
    }
    expect(() =>
        Route({ path: "/foo/:foo/bar/:bar", component }, [])()
    ).not.toThrowError()
})
