// import { IconBrackets } from '@codexteam/icons';

export default class MarkerTool {
  static get isInline() {
    return true;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({ api }) {
    this.api = api;
    this.button = null;
    this._state = false;

    this.tag = 'M';
    this.class = 'cdx-review';

    this.note = null;

    this.nodes = {
      inputWrapper: null,
      input: null,
      inputConfirm: null,
    };
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  surround(range) {
    if (this.state) {
      this.unwrap(range);

      return;
    }

    this.wrap(range);
  }

  wrap(range) {
    const selectedText = range.extractContents();
    const mark = document.createElement(this.tag);

    mark.classList.add(this.class);
    mark.appendChild(selectedText);
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
  }

  unwrap(range) {
    console.log('unwrap');
    const mark = this.api.selection.findParentTag(this.tag, this.class);
    const text = range.extractContents();

    mark.remove();

    range.insertNode(text);
  }

  checkState() {
    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;

    if (this.state) {
      this.showActions(mark);
    } else {
      this.hideActions();
    }
  }

  renderActions() {
    this.nodes.inputWrapper = document.createElement('div');
    this.nodes.inputWrapper.classList.add('ce-review-input-wrapper');
    this.nodes.inputWrapper.hidden = true;

    this.nodes.input = document.createElement('input');
    this.nodes.input.type = 'text';
    this.nodes.input.placeholder = 'Enter note';
    this.nodes.inputWrapper.appendChild(this.nodes.input);

    this.nodes.inputConfirm = document.createElement('button');
    this.nodes.inputConfirm.type = 'button';
    this.nodes.inputConfirm.textContent = 'OK';
    this.nodes.inputWrapper.appendChild(this.nodes.inputConfirm);

    return this.nodes.inputWrapper;
  }

  showActions(mark) {
    this.nodes.input.value = this.note || mark.dataset.note || '';
    this.note = this.nodes.input.value;

    this.nodes.input.onchange = () => {
      this.note = this.nodes.input.value;
    };

    this.nodes.inputConfirm.onclick = () => {
      console.log('confirm', this.note);
      mark.dataset.note = this.note;

      // remove all ranges
      document.getSelection().removeAllRanges();
    };

    this.nodes.inputWrapper.hidden = false;
  }

  hideActions() {
    this.nodes.input.onchange = null;
    this.nodes.inputWrapper.hidden = true;
  }

  static get sanitize() {
    return {
      mark: {
        class: 'cdx-marker',
      },
    };
  }
}
