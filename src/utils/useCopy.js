// @flow
import React, { useEffect, useState } from 'react';
import {
  get,
} from 'lodash';
import { toast } from 'react-toastify';
import { Popover } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboard, faCopy, faImage,
} from '@fortawesome/free-solid-svg-icons';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames';

type CopyProps = {
    enabled: boolean,
};

const useCopy = ({ enabled } : CopyProps): any => {
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    selection: '',
    isImage: false,
    imageSrc: '',
  });

  const clearContextMenu = () => {
    setContextMenu({
      show: false,
      x: 0,
      y: 0,
      selection: '',
      isImage: false,
      imageSrc: '',
    });
  };

  const onRightClick = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      selection: window.getSelection().toString(),
      isImage: get(e.target, 'tagName') === 'IMG',
      imageSrc: get(e.target, 'src'),
    });
  };

  const onMouseDown = (e: any) => {
    if (e.target && get(e.target, 'tagName') === 'A') {
      window.open(e.target.href, '_blank');
    } else if (e.target && get(e.target, 'parentElement.tagName') === 'A') {
      window.open(e.ref, '_blank');
    }
  };

  const copySelectedToClipboard = (text?: string) => {
    if (!contextMenu.selection) return;

    navigator.clipboard.writeText(text || contextMenu.selection);
    clearContextMenu();

    toast.success('Copied to clipboard');
  };

  useHotkeys('ctrl+c, c, meta+c', () => {
    copySelectedToClipboard(window.getSelection().toString());
  });

  const referenceSelectedText = () => {
    if (!contextMenu.selection) return;

    const text = contextMenu.selection;
    const url = window.location.href;
    const reference = `${text} (${url})`;
    navigator.clipboard.writeText(reference);
    clearContextMenu();

    toast.success('Copied to clipboard');
  };

  const onEditorKeyDown = (e: any) => {
    e.preventDefault();
  };

  useEffect(() => {
    const editorWrapper = document.querySelector('.editorjs-wrapper');
    if (editorWrapper && enabled) {
      editorWrapper.addEventListener('contextmenu', onRightClick);
      editorWrapper.addEventListener('keydown', onEditorKeyDown);
      editorWrapper.addEventListener('mousedown', (e) => {
        if (e.button === 0 || e.button === 1) {
          onMouseDown(e);
        }
      });
    }

    return () => {
      if (editorWrapper) {
        editorWrapper.removeEventListener('contextmenu', onRightClick);
        editorWrapper.removeEventListener('mousedown', onMouseDown);
        editorWrapper.removeEventListener('keydown', onEditorKeyDown);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Popover
      className='editorjs-context-menu-popover unselectable'
      open={contextMenu.show}
      anchorReference="anchorPosition"
      anchorPosition={{ top: contextMenu.y, left: contextMenu.x }}
      onClose={() => clearContextMenu()}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <div className="editorjs-context-menu">
        {contextMenu.isImage && (
        <div
          onClick={() => {
            const link = document.createElement('a');
            link.href = contextMenu.imageSrc;
            link.download = contextMenu.imageSrc;
            link.click();
          }}
          className={classNames('editorjs-context-menu-item',
            { 'editorjs-context-menu-item-disabled': !contextMenu.selection })}
        >
          <FontAwesomeIcon icon={faImage} style={{ width: 20, height: 20, marginRight: 10 }} />
          <p>Save image</p>
        </div>
        ) }
        <div
          onClick={() => {
            copySelectedToClipboard();
          }}
          className={classNames('editorjs-context-menu-item',
            { 'editorjs-context-menu-item-disabled': !contextMenu.selection })}
        >
          <FontAwesomeIcon icon={faCopy} style={{ width: 20, height: 20, marginRight: 10 }} />
          <p>Copy</p>
        </div>
        <div
          onClick={() => {
            referenceSelectedText();
          }}
          className={classNames('editorjs-context-menu-item',
            { 'editorjs-context-menu-item-disabled': !contextMenu.selection })}
        >
          <FontAwesomeIcon icon={faClipboard} style={{ width: 20, height: 20, marginRight: 10 }} />
          <p>Reference</p>
        </div>
      </div>
    </Popover>
  );
};

export default useCopy;
