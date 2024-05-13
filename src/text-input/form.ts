import { createComponent } from '../component.fp.js';

const MyComponent = createComponent({
  cssPath: './form.css',
  render: (state) => {
    return `
      <form>
        <button id="delete-button">Delete text-input shadow DOM</button>

        <ui-text-input fieldname="firstname" value="Johnny">
          <div slot="label">Custom Label</div>
          <div slot="message">Do something!</div>
        </ui-text-input>
      </form>
    `;
  },
});

customElements.define('ui-form', MyComponent);
