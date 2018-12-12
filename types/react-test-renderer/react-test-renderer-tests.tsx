import * as React from "react";
import { create, ReactTestInstance } from "react-test-renderer";
import { createRenderer } from 'react-test-renderer/shallow';

class TestComponent extends React.Component { }

create(<TestComponent />);

const renderer = create(React.createElement("div"), {
    createNodeMock: (el: React.ReactElement<any>) => {
        return {};
    }
});

const json = renderer.toJSON();
if (json) {
    json.type = "t";
    json.props = {
        prop1: "p",
    };
    json.children = [json];
}

const tree = renderer.toTree();
if (tree) {
    tree.type = "t";
    tree.props = {
        prop1: "p",
    };
    tree.children = [tree];
    tree.rendered = tree;
    tree.nodeType = "component";
    tree.nodeType = "host";
}

renderer.update(React.createElement(TestComponent));

renderer.unmount();
renderer.unmount(React.createElement(TestComponent));

function testInstance(inst: ReactTestInstance) {
    inst.children = [inst, "a"];
    inst.parent = instance;
    inst.parent = null;
    inst.props = {
        prop1: "p",
    };
    inst.type = "a";
    testInstance(inst.find(n => n.type === "a"));
    testInstance(inst.findByProps({ prop1: "p" }));
    testInstance(inst.findByType("a"));
    testInstance(inst.findByType(TestComponent));
    inst.findAll(n => n.type === "t", { deep: true }).map(testInstance);
    inst.findAllByProps({ prop1: "p" }, { deep: true }).map(testInstance);
    inst.findAllByType("a", { deep: true }).map(testInstance);
    inst.findAllByType(TestComponent, { deep: true }).map(testInstance);
}

const instance = renderer.getInstance();
if (instance) {
    testInstance(instance);
}

testInstance(renderer.root);

const component = React.createElement(TestComponent);
const shallowRenderer = createRenderer();
shallowRenderer.render(component);
shallowRenderer.getRenderOutput();
shallowRenderer.getMountedInstance();


// Example taken from https://reactjs.org/docs/test-renderer.html#overview
{
    const Link: React.FunctionComponent<{page: string}> = (props) => {
        return <a href={props.page}>{props.children}</a>;
    }

    const testRenderer = create(
        <Link page="https://www.facebook.com/">Facebook</Link>
    );

    // $ExpectType { type: 'a', props: { href: 'https://www.facebook.com/' }, children: [ 'Facebook' ] }
    console.log(testRenderer.toJSON());
    // { type: 'a',
    //   props: { href: 'https://www.facebook.com/' },
    //   children: [ 'Facebook' ] }
}


// Example taken from https://reactjs.org/docs/test-renderer.html#overview
{
    const MyComponent: React.FunctionComponent = () => {
        return (
            <div>
                <SubComponent foo="bar" />
                <p className="my">Hello</p>
            </div>
        )
    }

    const SubComponent: React.FunctionComponent<{foo: string}> = () => {
        return (
            <p className="sub">Sub</p>
        );
    }

    const testRenderer = create(<MyComponent />);
    const testInstance = testRenderer.root;

    // $ExpectType 'bar'
    testInstance.findByType(SubComponent).props.foo;
    // $ExpectType ['Sub']
    testInstance.findByProps({className: "sub"}).children;
}


// Test component with getDerivedStateFromProps()
{
    interface Props {
        firstName: string;
        lastName: string;
    }

    interface State {
        name: string;
    }

    class TestComponent extends React.Component<Props, State> {
        static getDerivedStateFromProps(nextProps: Props, prevState: State) {
            return {
                name: `${nextProps.firstName} ${nextProps.lastName}`
            };
        }
    }

    const renderer = create(<TestComponent firstName="foo" lastName="bar" />);

    // $ExpectType ReactTestInstance
    renderer.root.find(node => node.type === 'button');
    // $ExpectType ReactTestInstance
    renderer.root.findByType(TestComponent);
    // $ExpectType ReactTestInstance
    renderer.root.findByProps({ firstName: 'John'});
    // $ExpectType ReactTestInstance
    renderer.root.findByProps({ lastName: 'Doe'});
    // $ExpectType ReactTestInstance
    renderer.root.findByProps({ firstName: 'John', lastName: 'Doe'});

    // $ExpectType ReactTestInstance[]
    renderer.root.findAll(node => node.type === 'button');
    // $ExpectType ReactTestInstance[]
    renderer.root.findAllByType(TestComponent);
    // $ExpectType ReactTestInstance[]
    renderer.root.findAllByProps({ firstName: 'John'});
    // $ExpectType ReactTestInstance[]
    renderer.root.findAllByProps({ lastName: 'Doe'});
    // $ExpectType ReactTestInstance[]
    renderer.root.findAllByProps({ firstName: 'John', lastName: 'Doe'});
}
