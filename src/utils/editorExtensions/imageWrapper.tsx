// @ts-nocheck
import Image from "@editorjs/image";

export class ImageWrapper extends Image {
  static get tunes() {
    const defaultTunes = super.tunes;

    return defaultTunes.concat([
      {
        name: "center",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><!-- Alignment Icon - Left --><rect x="10" y="20" width="20" height="60" fill="#333" /><!-- Alignment Icon - Center --><rect x="40" y="30" width="20" height="40" fill="#333" /><rect x="40" y="30" width="20" height="40" fill="#fff" opacity="0.5" /><!-- Alignment Icon - Right --><rect x="70" y="20" width="20" height="60" fill="#333" /><!-- Alignment Icon - Justify --><rect x="20" y="80" width="60" height="10" fill="#333" /><rect x="20" y="80" width="60" height="10" fill="#fff" opacity="0.5" /></svg>',
        title: "Center Image",
        toggle: true,
      },
    ]);
  }

  set data(data) {
    this.image = data.file;

    this._data.caption = data.caption || "";
    this.ui.fillCaption(this._data.caption);

    ImageWrapper.tunes.forEach(({ name: tune }) => {
      const value =
        typeof data[tune] !== "undefined"
          ? data[tune] === true || data[tune] === "true"
          : false;

      this.setTune(tune, value);
    });
  }

  get data() {
    return this._data;
  }

  renderSettings() {
    // Merge default tunes with the ones that might be added by user
    // @see https://github.com/editor-js/image/pull/49
    const tunes = ImageWrapper.tunes.concat(this.config.actions);

    return tunes.map((tune) => ({
      icon: tune.icon,
      label: this.api.i18n.t(tune.title),
      name: tune.name,
      toggle: tune.toggle,
      isActive: this.data[tune.name],
      onActivate: () => {
        /* If it'a user defined tune, execute it's callback stored in action property */
        if (typeof tune.action === "function") {
          tune.action(tune.name);

          return;
        }
        this.tuneToggled(tune.name);
      },
    }));
  }

  setTune(tuneName, value) {
    this._data[tuneName] = value;

    this.ui.applyTune(tuneName, value);

    if (tuneName === "stretched") {
      /**
       * Wait until the API is ready
       */
      Promise.resolve()
        .then(() => {
          this.block.stretched = value;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    }
  }

  render() {
    if (this.readOnly) {
      const wrapper = this.ui.render(this.data);
      // wrapper.querySelector('.cdx-input').remove();
      wrapper.querySelector(".cdx-button").remove();

      return wrapper;
    }

    return this.ui.render(this.data);
  }

  static get pasteConfig() {
    return {
      /**
       * Paste HTML into Editor
       */
      tags: [
        {
          img: { src: true },
        },
      ],
      /**
       * Paste URL of image into the Editor
       */
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|svg|webp)(\?.*)?$/i,
      },

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ["image/*"],
      },
    };
  }
}
