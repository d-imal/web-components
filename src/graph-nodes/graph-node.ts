import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {
  display: block;
  border: 2px solid black;
  padding: 10px;
  font-family: sans-serif;
}
`;

const template = `
  <div>
    <slot name="name">Node</slot>
  </div>
`;

const GraphNode = createComponent({
  template,
  css,
  attrHandlers: {},
});

customElements.define('graph-node', GraphNode);