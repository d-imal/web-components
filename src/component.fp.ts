export type IAttrHandler = ({ shadowRoot, value }: { shadowRoot: ShadowRoot; value: string }) => void;

export function createComponent({
  template,
  css,
  attrHandlers,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
}: {
  template: string | ((unknown) => string);
  css: string;
  attrHandlers?: Record<string, IAttrHandler>;
  shadowDomSettings?: ShadowRootInit;
}) {
  class Component extends HTMLElement {
    #shadowRoot;

    constructor() {
      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);

      const content = typeof template === 'function' ? template(null) : template;

      this.#shadowRoot.innerHTML = `<style>${css}</style>${content}`;
    }

    connectedCallback() {
      console.log('Custom element added to page.');

      // TODO: Render with any attributes
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
      const slotElement = this.#shadowRoot.querySelector(`slot[name='${attrName}']`);

      attrHandlers[attrName]({
        shadowRoot: this.#shadowRoot,
        value: this.getAttribute(attrName),
      });
    }

    disconnectedCallback() {}
    adoptedCallback() {}
  }

  return Component;
}
