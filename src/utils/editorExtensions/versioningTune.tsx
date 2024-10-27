import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { createRoot } from "react-dom/client";
import { store } from "../../store/index.tsx";
import articleActions from "../../store/article/actions.ts";

export default class VersioningTune {
  api: any;

  data: any;

  config: any;

  block: any;

  wrapper: any;

  toggleClass: string;

  static previousWrapper: HTMLElement | null = null;

  static uncheckOldWrapper(currentVB: any, toggleClass: string) {
    const vbWrapper = currentVB?.closest(`.${toggleClass}`);
    if (vbWrapper) vbWrapper.classList.remove(toggleClass);
  }

  constructor({ api, data, config, block }: any) {
    this.api = api;
    this.data = data;
    this.config = config;
    this.block = block;

    this.toggleClass = "cdx-versioning-selected";
    this.wrapper = undefined;
  }

  static get isTune(): any {
    return true;
  }

  static get CSS(): any {
    return {
      toggler: "cdx-text-variant__toggler", // has svg icon
    };
  }

  render(): any {
    // const tuneWrapper = document.createElement('button');
    // tuneWrapper.classList.add(this.api.styles.settingsButton);

    // const toggler = document.createElement('div');
    // toggler.classList.add(this.api.styles.settingsButton);
    // tuneWrapper.classList.toggle(this.api.styles.settingsButtonActive, this.vbId.current === this.block.id);

    // const root = createRoot(tuneWrapper);
    // root.render(
    //   <div className="cdx-versioning-info-card__title">😸 Block settings</div>,
    // );

    // this.api.tooltip.onHover(tuneWrapper, 'Block settings', {
    //   placement: 'top',
    //   hidingDelay: 500,
    // });

    const svgIcon = document.createElement("div");
    const root2 = createRoot(svgIcon);
    root2.render(
      <FontAwesomeIcon className="cdx-svg-icon-versioning" icon={faPerson} />
    );

    const svg = svgIcon.querySelector(".cdx-svg-icon-versioning");

    return {
      icon: svg,
      label: "Block settings",
      toggle: true,
      onActivate: () => {
        this.tuneClicked();
      },
      isActive: VersioningTune.activeBlockId === this.block.id,
    };
  }

  // uncheckOldWrapper(): any {
  //   const vbWrapper = this.vb.current?.closest(`.${this.toggleClass}`);
  //   if (vbWrapper) vbWrapper.classList.remove(this.toggleClass);

  //   const infoCard = document.querySelector('.cdx-versioning-info-card');
  //   if (infoCard) infoCard.remove();
  // }

  static setActiveBlockId(newId: string | null) {
    store.dispatch(articleActions.setActiveBlock(newId));
  }

  static get activeBlockId(): any {
    return store.getState().article.activeBlock?.id || null;
  }

  checkCurrentWrapper(): any {
    if (this.wrapper) this.wrapper.classList.add(this.toggleClass);
  }

  tuneClicked(): any {
    console.log("tune clicked");
    // this.toggleButton(event);
    const blockContent = this.wrapper.querySelector(".ce-block__content");

    VersioningTune.uncheckOldWrapper(
      VersioningTune.previousWrapper,
      this.toggleClass
    );

    const id = VersioningTune.activeBlockId;

    if (id === this.block.id) {
      VersioningTune.setActiveBlockId(null);

      VersioningTune.previousWrapper = null;
    } else if (id !== this.block.id) {
      this.checkCurrentWrapper();
      VersioningTune.setActiveBlockId(this.block.id);
      VersioningTune.previousWrapper = blockContent;

      // const editorWrapper = document.getElementById('editorjs');
      // if (editorWrapper && editorWrapper.parentNode) editorWrapper.parentNode.appendChild(this.generateInfoCard());
    }
  }

  wrap(blockContent: any): any {
    this.wrapper = document.createElement("div");
    this.wrapper.appendChild(blockContent);

    return this.wrapper;
  }

  save(): any {
    return this.data || "";
  }
}
