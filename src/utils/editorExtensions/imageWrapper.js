import Image from '@editorjs/image';

export class ImageWrapper extends Image {
  render() {
    if (this.readOnly) {
      const wrapper = this.ui.render(this.data);
      // remove div from wrapper
      // wrapper.querySelector('.cdx-input').remove();
      wrapper.querySelector('.cdx-button').remove();

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
        mimeTypes: ['image/*'],
      },
    };
  }
}
