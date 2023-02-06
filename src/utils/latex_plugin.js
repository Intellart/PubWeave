/* eslint-disable no-unused-vars */
import { MathfieldElement } from 'mathlive';

export default class LatexPlugin {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
     * Should this tool be displayed at the Editor's Toolbox
     *
     * @returns {boolean}
     * @public
     */
  static get displayInToolbox() {
    return true;
  }

  /**
     * Allow to press Enter inside the RawTool textarea
     *
     * @returns {boolean}
     * @public
     */
  static get enableLineBreaks() {
    return true;
  }

  /**
     * Get Tool toolbox settings
     * icon - Tool icon's SVG
     * title - title to show in toolbox
     *
     * @returns {{icon: string, title: string}}
     */
  static get toolbox() {
    return {
      // icon: IconHtml,
      title: 'Equation',
    };
  }

  /**
     * @typedef {object} RawData — plugin saved data
     * @param {string} html - previously saved HTML code
     * @property
     */

  /**
     * Render plugin`s main Element and fill it with saved data
     *
     * @param {RawData} data — previously saved HTML data
     * @param {object} config - user config for Tool
     * @param {object} api - CodeX Editor API
     * @param {boolean} readOnly - read-only mode flag
     */
  constructor({
    data, config, api, readOnly,
  }) {
    this.api = api;
    this.readOnly = readOnly;

    this.mfe = new MathfieldElement();

    this.placeholder = config.placeholder || LatexPlugin.DEFAULT_PLACEHOLDER;

    this.CSS = {
      baseClass: 'ce-rawtool2',
      input: 'ce-rawtool2',
      wrapper: 'ce-rawtool2',
      textarea: 'ce-rawtool__textare3a',
    };

    this.data = {
      html: data.html || '',
    };

    this.resizeDebounce = null;
  }

  /**
     * Return Tool's view
     *
     * @returns {HTMLDivElement} this.element - RawTool's wrapper
     * @public
     */
  render() {
    const wrapper = document.createElement('div');
    const renderingTime = 100;

    this.mfe.addEventListener('keydown', (evt) => {
      // prevent default behavior if arrow keys are pressed
      if (evt.key.startsWith('Arrow')) {
        evt.preventDefault();
      }

      return { capture: true };
    });
    this.mfe.setOptions({
      virtualKeyboardMode: 'manual',
      virtualKeyboards: 'numeric symbols functions roman greek',
    });

    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);

    this.mfe.classList.add(this.CSS.textarea, this.CSS.input);
    this.mfe.textContent = this.data.html;
    this.mfe.placeholder = this.placeholder;

    if (this.readOnly) {
      this.mfe.disabled = true;
    } else {
      this.mfe.addEventListener('input', () => {
        this.onInput();
      });
    }

    wrapper.appendChild(this.mfe);

    setTimeout(() => {
      this.resize();
    }, renderingTime);

    return wrapper;
  }

  /**
     * Extract Tool's data from the view
     *
     * @param {HTMLDivElement} rawToolsWrapper - RawTool's wrapper, containing textarea with raw HTML code
     * @returns {RawData} - raw HTML code
     * @public
     */
  save(rawToolsWrapper) {
    return {
      html: rawToolsWrapper.querySelector('math-field').value,
    };
  }

  /**
     * Default placeholder for RawTool's textarea
     *
     * @public
     * @returns {string}
     */
  static get DEFAULT_PLACEHOLDER() {
    return 'Enter HTML code';
  }

  /**
     * Automatic sanitize config
     */
  static get sanitize() {
    return {
      html: true, // Allow HTML tags
    };
  }

  /**
     * Textarea change event
     *
     * @returns {void}
     */
  onInput() {
    if (this.resizeDebounce) {
      clearTimeout(this.resizeDebounce);
    }

    this.resizeDebounce = setTimeout(() => {
      this.resize();
    }, 200);
  }

  /**
     * Resize textarea to fit whole height
     *
     * @returns {void}
     */
  resize() {
    this.mfe.style.height = 'auto';
    this.mfe.style.height = this.mfe.scrollHeight + 'px';
  }
}
