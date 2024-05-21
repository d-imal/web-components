import { jsx, Fragment, VNode } from 'snabbdom';
import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

interface IHelloModel {
  foo: string;
}
const SnabbdomComponent = createDecoratedComponent<['foo'], IHelloModel>({
  css: '.myClass { color: red; }',
  attributes: ['foo'],
  mapAttributesToModel(attributes, model) {
    return {
      ...model,
      foo: attributes.foo,
    };
  },
  render: (model) => {
    console.log({ model });

    return (
      <div class={{ myClass: true }}>
        This is JSX
        <div>{model?.foo}</div>
      </div>
    );
  },
});

customElements.define('hello-vdom', SnabbdomComponent);
