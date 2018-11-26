const { Router, Switch } = require("./dist")
const ui = require("hyperoop");

class App extends ui.Actions {
    constructor() {
        super({});
        this.router = new Router(this, ui.h);
    }
}

let app = new App();

test("Switch expects children are implemented as lazy components", () => {
    const child = jest.fn();
    Switch(null, [child])();
    expect(child.mock.calls.length).toBe(1);
})

test("Switch returns only the first truthy child", () => {
    const children = [
        jest.fn(() => 0),
        jest.fn(() => null),
        jest.fn(() => "first truthy value"),
        jest.fn(() => "another truthy")
    ]
    expect(Switch(null, children)()).toEqual("first truthy value")
    expect(children[3]).not.toBeCalled()
})

test("Switch returns falsy when all children falsy", () => {
    const children = [
        jest.fn(() => 0),
        jest.fn(() => ""),
        jest.fn(() => false),
        jest.fn(() => null)
    ]
    expect(Switch(null, children)()).toBeFalsy()
})

test("Switch returns falsy when children is empty", () => {
    expect(Switch(null, [])()).toBeFalsy()
})
