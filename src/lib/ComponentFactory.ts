import { VNode } from 'snabbdom';
import { applyCss } from './CssUtils';
import { patchDom } from './VirtualDom';

export { jsx } from './VirtualDom';

export interface ICreateComponentArgs<AttributeNames extends string[], Model> {
  connectedCallback?: (instance: ComposeElement<Model>) => void;
  disconnectedCallback?: (instance: ComposeElement<Model>) => void;
  attributeChangedCallback?: (
    instance: ComposeElement<Model>,
    attrName: string,
    oldVal: string,
    newVal: string
  ) => void;
  adoptedCallback?: (element: HTMLElement) => void;
  attributes?: AttributeNames;
  shadowDomSettings?: ShadowRootInit;
  mapAttributesToModel?: (attributes: Record<AttributeNames[number], string>, model: Model) => Model;
  render: (params: Model) => VNode;
  css?: string;
  cssPath?: string;
  tagName: string;
  initialModel: Model;
}

export interface ComposeElement<Model> extends HTMLElement {
  setModel: (newModel: Model) => void;
  model: Model;
  shadowRoot: ShadowRoot;
  container: HTMLElement;
}

export function createComponent<AttributeNames extends string[], Model>({
  attributes,
  shadowDomSettings = { mode: 'closed' },
  mapAttributesToModel,
  render,
  css,
  cssPath,
  tagName,
  initialModel,
  adoptedCallback,
  disconnectedCallback,
}: ICreateComponentArgs<AttributeNames, Model>) {
  type Attributes = Record<AttributeNames[number], string>;

  class Component extends HTMLElement implements ComposeElement<Model> {
    public model: Model;
    public container: HTMLElement;
    #shadowRoot: ShadowRoot;

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      super();

      this.setModel(initialModel);
      this.#shadowRoot = this.attachShadow(shadowDomSettings);
      this.container = document.createElement('div');
      this.#shadowRoot.appendChild(this.container);
    }

    async connectedCallback() {
      // console.log(this.tagName, '--- connectedCallback');
      this.render(this.model);
      await applyCss(this.#shadowRoot, cssPath, css);
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
      if (mapAttributesToModel) {
        const newModel = mapAttributesToModel(getAttributes(this), this.model);

        this.setModel(newModel);
        this.render(this.model);
      }
    }

    disconnectedCallback() {
      disconnectedCallback(this);
    }

    adoptedCallback() {
      adoptedCallback(this);
    }

    setModel(patch: Model) {
      this.model = {
        ...this.model,
        ...patch,
      };
    }

    render(model: Model) {
      const vdom = render(model);

      patchDom(this.container, vdom);
    }
  }

  function getAttributes(component: HTMLElement): Attributes {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => [attrName, component.getAttribute(attrName)])
    ) as Attributes;
  }

  return Component;
}
