import { IAttrHandler, ITemplateParams, createComponent } from '../component.fp.js';

const defaultHandler: IAttrHandler = ({ value }) => (value ? value : '');

const MyComponent = createComponent({
  cssPath: './text-input.css',
  attrHandlers: {
    fieldname: defaultHandler,
    value: defaultHandler,
  },
  template: (values: ITemplateParams) => {
    return `
      <div>
        <label><slot name="label"></slot></label>
        <div><input type="text" name="${values.fieldname}" value="${values.value}"></div>
        <p class='my-message'><slot name="message"></slot></p>
      </div>
    `;
  },
});

customElements.define('ui-text-input', MyComponent);
