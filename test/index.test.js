const ui = require("hyperoop");
const { Router, Route, Link, Redirect } = require("./dist");

const wait = async ms => new Promise(resolve => setTimeout(resolve, ms))
const click = e => e.dispatchEvent(new MouseEvent("click", { button: 0 }))

class App extends ui.Actions {
    constructor() {
        super({});
        this.router = new Router(this, ui.h);
    }
}

let app = null;
let pathname = "";

const beforeEach = () => {
    document.body.innerHTML = "";
    app = new App();
    pathname = window.location.pathname;
};

const afterEach = () => {
    app.router.go(pathname);
    app.router.stop();
    app = null;
};

test("Transition by location.go()", async done => {
    beforeEach();

    const spy = jest.fn();
    const view = () => ui.h(Route, { path: "/test", component: spy });
    ui.init(document.body, view, app);
    await wait(0);
    expect(spy).not.toBeCalled();

    app.router.go("/test");
    await wait(0);
    expect(spy).toBeCalled();

    afterEach();
    done();
})

test("Transition by clicking Link", async done => {
    beforeEach();

    const spy = jest.fn()
    const view = () =>
        ui.h("div", {},
            ui.h(Link, {to: "/test"}),
            ui.h(Route, { path: "/test", component: spy }),
        );
    ui.init(document.body, view, app);
    await wait(0);
    expect(spy).not.toBeCalled();

    const el = document.body.getElementsByTagName("a")[0];
    click(el);
    await wait(0);
    expect(spy).toBeCalled();

    // Clicking the same link again doesn't cause transition.
    const count = spy.mock.calls.length;
    click(document.body.getElementsByTagName("a")[0]);
    await wait(0);
    expect(spy).toHaveBeenCalledTimes(count);

    afterEach();
    done();
})

test("Click external Link", async done => {
    beforeEach();
    const view = () => ui.h(Link, { to: "http://example.com/" });

    ui.init(document.body, view, app);
    await wait(0)
    expect(window.location.pathname).toEqual("/")

    click(document.body.getElementsByTagName("a")[0])
    await wait(0)
    expect(window.location.pathname).toEqual("/")

    afterEach();
    done();
})

test("Transition by clicking Link including non alphanumeric characters", async done => {
    beforeEach();

    const spy = jest.fn()
    const view = () =>
        ui.h("div", {},
            ui.h(Link, { to: "/test/café" }),
            ui.h(Route, { path: "/test/:id", component: spy }),
        );

    ui.init(document.body, view, app);
    await wait(0);
    expect(spy).not.toBeCalled();

    click(document.body.getElementsByTagName("a")[0]);
    await wait(0);
    expect(spy).toBeCalled();

    expect(spy.mock.calls[0][0].match.params).toEqual({ id: "café" });
    expect(window.location.pathname).toEqual("/test/caf%C3%A9");

    afterEach();
    done();
})

test("Transition by rendering Redirect", async done => {
    beforeEach();

    const spy = jest.fn();
    const view = () =>
        ui.h("div", {},
            ui.h(Route, {
                id: 1,
                path: "/test",
                component: () => ui.h(Redirect, { to: "/somewhere" })
            }),
            ui.h(Route, { id: 2, path: "/somewhere", component: spy })
        );

    ui.init(document.body, view, app);
    await wait(0);
    expect(spy).not.toBeCalled();

    app.router.go("/test");
    await wait(0);
    expect(spy).toBeCalled();

    afterEach();
    done();
})
