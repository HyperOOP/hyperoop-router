const { Router, Link } = require("./dist")
const ui = require("hyperoop");

class App extends ui.Actions {
    constructor() {
        super({});
        this.router = new Router(this, ui.h);
    }
}

let app = new App();

test('Link passes given attributes except "to" and "location" to underlying element', () => {
    const vnode = Link({ to: "/path", pass: "through" });
    expect(vnode.attributes.to).toBeUndefined();
    expect(vnode.attributes.href).toEqual("/path");
    expect(vnode.attributes.pass).toEqual("through");
})

test('Link constructs `href` from `to` object', () => {
    const vnode = Link({ to: {pathname: "/path", search: "f=1&g=ff", hash: "ddd"} });
    expect(vnode.attributes.to).toBeUndefined();
    expect(vnode.attributes.href).toEqual("/path?f=1&g=ff#ddd");
})

test("Calling onclick of VNode transparently calls Link's onclick prop", () => {
    const onclickProp = jest.fn();
    const vnode = Link({ onclick: onclickProp });
    const event = new Object();
    expect(vnode.attributes.onclick).not.toBe(onclickProp);
    vnode.attributes.onclick(event);
    expect(onclickProp).toBeCalledWith(event);
})
