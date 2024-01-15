// @flow
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  difference,
  every,
  first,
  forEach,
  get,
  includes,
  isEmpty,
  isEqual,
  keyBy,
  keys,
  map,
  pickBy,
  size,
  sortBy,
  sum,
  toNumber,
  uniq,
  values,
  words,
} from 'lodash';
import { useInView } from 'react-intersection-observer';
import apiClient from '../api/axios';
import type {
  Block,
  BlockCategoriesToChange,
  BlockFromBackend,
  BlockFromEditor,
  BlockToChange,
  Blocks,
  BlocksFromBackend,
  BlocksFromEditor,
  BlocksToChange,
  SimpleBlock,
  _BlockFromEditor,
} from '../store/articleStore';
import { EditorStatus } from '../components/editor/Editor';
import type { EditorStatusType } from '../components/editor/Editor';

export const regex: Object = {
  specialChars: /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
  numbers: /[0-9]/,
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const checks = ({
  empty: {
    check: (value: string): bool => size(value) > 0,
    info: 'Cannot be empty',
  },
  maxlength: {
    check: (value: string): bool => size(value) < 30,
    info: 'Cannot be longer than 30 characters',
  },
  special: {
    check: (value: string): bool => !regex.specialChars.test(value),
    info: 'Cannot contain special characters',
  },
  space: {
    check: (value: string): bool => !includes(value, ' '),
    info: 'Cannot contain spaces',
  },
  number: {
    check: (value: string): bool => !regex.numbers.test(value),
    info: 'Cannot contain numbers',
  },
  email: {
    check: (value: string): bool => regex.email.test(value),
    info: 'Invalid email',
  },
});

export const usernameChecks = [
  checks.empty,
  checks.maxlength,
  checks.space,
  checks.special,
];

export const nameChecks = [
  checks.empty,
  checks.maxlength,
  checks.number,
  checks.special,
];

export const emailChecks = [
  checks.empty,
  checks.email,
];

export const permissions = {
  webSockets: 'WEB_SOCKETS',
  criticalSections: 'CRITICAL_SECTIONS',
  REVIEW_OR_EDIT_BLOCKS: 'REVIEW_OR_EDIT_BLOCKS',
  ADD_OR_REMOVE_BLOCKS: 'ADD_OR_REMOVE_BLOCKS',
  locking: 'LOCKING',
  configMenu: 'CONFIG_MENU',
  history: 'HISTORY',
  collaborators: 'COLLABORATORS',
  DELETE_ARTICLE: 'DELETE_ARTICLE',
  ARTICLE_SETTINGS: 'ARTICLE_SETTINGS',
  LIKE_ARTICLE: 'LIKE_ARTICLE',
  SHARE_ARTICLE: 'SHARE_ARTICLE',
  COMMENT_ARTICLE: 'COMMENT_ARTICLE',
  SWITCH_ARTICLE_TYPE: 'SWITCH_ARTICLE_STATUS',
};

type EditorPermissionProps = {
  type: 'blog_article' | 'preprint' | 'scientific_article',
  status: EditorStatusType,
  userId?: number,
  ownerId?: number,
  isReviewer?: boolean,
  isCollaborator?: boolean,
};

export const editorPermissions = ({
  type, status, userId, ownerId, isReviewer, isCollaborator,
}: EditorPermissionProps): any => ({
  scientific_article: {
    [EditorStatus.IN_PROGRESS]: {
      [permissions.webSockets]: true,
      [permissions.criticalSections]: true,
      [permissions.locking]: true,
      [permissions.configMenu]: true,
      [permissions.history]: true,
      [permissions.collaborators]: true,
    },
    [EditorStatus.PUBLISHED]: {
    },
    [EditorStatus.PREVIEW]: {
    },
  },
  preprint: {
    [EditorStatus.IN_PROGRESS]: {
      [permissions.webSockets]: true,
      [permissions.criticalSections]: true,
      [permissions.locking]: true,
      [permissions.configMenu]: true,
      [permissions.history]: true,
      [permissions.collaborators]: true,
      [permissions.REVIEW_OR_EDIT_BLOCKS]: userId === ownerId || isReviewer || isCollaborator,
      [permissions.ADD_OR_REMOVE_BLOCKS]: userId === ownerId,
      [permissions.DELETE_ARTICLE]: userId === ownerId,

    },
    [EditorStatus.PUBLISHED]: {
    },
    // [EditorStatus.PREVIEW]: {
    // },
  },
  blog_article: {
    [EditorStatus.IN_PROGRESS]: {
      [permissions.REVIEW_OR_EDIT_BLOCKS]: userId === ownerId || isReviewer,
      [permissions.ADD_OR_REMOVE_BLOCKS]: userId === ownerId,
      [permissions.DELETE_ARTICLE]: userId === ownerId,
      [permissions.SWITCH_ARTICLE_TYPE]: userId === ownerId,
      [permissions.ARTICLE_SETTINGS]: true,
    },
    [EditorStatus.PUBLISHED]: {
      [permissions.LIKE_ARTICLE]: userId !== ownerId,

    },
    // [EditorStatus.PREVIEW]: {
    //   [permissions.SWITCH_ARTICLE_TYPE]: userId === ownerId,
    // },
    [EditorStatus.IN_REVIEW]: {
      [permissions.REVIEW_OR_EDIT_BLOCKS]: true,
      [permissions.DELETE_ARTICLE]: false,
      [permissions.ARTICLE_SETTINGS]: userId === ownerId,
    },
  },
}[type || 'blog_article'][(status:string)]);

export const isProdEnv = process.env.NODE_ENV === 'production';

export const buildRedirectLink = (path: string): string => window.location.origin + path;

export const orcidOAuthLink = (path: string): string => {
  const baseURL = isProdEnv ? 'https://orcid.org' : 'https://sandbox.orcid.org';
  const clientId = get(process.env, 'REACT_APP_ORCID_CLIENT_ID', '');

  return `${baseURL}/oauth/authorize?client_id=${clientId}&response_type=code&scope=/authenticate&redirect_uri=${buildRedirectLink(path)}`;
};

export const useScreenSize = (): Object => {
  const tabletQuery = window.matchMedia('(max-width: 991px)');
  const mobileQuery = window.matchMedia('(max-width: 769px)');
  const [screenSize, setScreenSize] = useState({
    isTablet: tabletQuery.matches,
    isMobile: mobileQuery.matches,
  });

  useEffect(() => {
    const handler = () => {
      setScreenSize({
        isTablet: tabletQuery.matches,
        isMobile: mobileQuery.matches,
      });
    };

    tabletQuery.addEventListener('change', handler);
    mobileQuery.addEventListener('change', handler);

    return () => {
      tabletQuery.removeEventListener('change', handler);
      mobileQuery.removeEventListener('change', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isDesktop: !screenSize.isTablet && !screenSize.isMobile,
    isTablet: screenSize.isTablet,
    isMobile: screenSize.isMobile,
  };
};

export const convertBlockToEditorJS = (block: Block): _BlockFromEditor => ({
  id: block.id,
  type: block.type,
  data: block.data,
});

// const checkIfCriticalSection = (newBlocks: any) => {
//   // let criticalSectionFound = false;

//   // const blockIds = map(blocks, (block) => get(block, 'id'));

//   // if (difference(blockIds, criticalSectionIds).length > 0) {
//   //   console.log('Critical section deleted');

//   //   return true;
//   // }

//   forEach(newBlocks, (block) => {
//     if (includes(criticalSectionIds, get(block, 'id'))) {
//       const oldBlockInd = findIndex(blocks, (o) => get(o, 'id') === get(block, 'id'));
//       const newBlockInd = findIndex(newBlocks, (o) => get(o, 'id') === get(block, 'id'));

//       // console.log(blocks[oldBlockInd], newBlocks[newBlockInd]);

//       if (isEqual(blocks[oldBlockInd], newBlocks[newBlockInd])) {
//         // console.log('Critical section not changed');

//         // return
//       }

//       // criticalSectionFound = true;
//     }
//   });

//   return false;
// };

export const getSmallReviewCount = (blocks: Blocks): any => {
  const reviewRegex = /<m.*?<\/m>/g;
  const reviews = [];

  forEach(blocks, (block) => {
    const text = get(block, 'data.text', '');
    const matches = [...text.matchAll(reviewRegex)];

    if (!isEmpty(matches)) {
      forEach(matches, (match) => {
        const matchToDom = document.createElement('div');
        matchToDom.innerHTML = first(match);
        const mElement = matchToDom.querySelector('m');

        if (!mElement) {
          return;
        }
        reviews.push({
          dataNote: mElement.getAttribute('data-note'),
          dataId: toNumber(mElement.getAttribute('data-reviewer-id')),
          dataName: mElement.getAttribute('data-reviewer-name'),
        });
      });
    }
  });

  return reviews;
};

export const getWordCount = (blocks: Blocks): number => sum(map(blocks, (block) => words(get(block, 'data.text')).length), 0);

export const areBlocksEqual = (block1: SimpleBlock, block2: SimpleBlock): boolean => isEqual(block1.type, block2.type) && isEqual(block1.data, block2.data);

export const convertToChangeBlock = (block: Block | BlockFromEditor, index: number): BlockToChange => ({
  id: block.id,
  type: block.type,
  data: block.data,
  position: block.position || index,
});

export const convertToChangeBlocks = (blocks: Blocks | BlocksFromEditor): BlocksToChange => keyBy(map(blocks, (block, index) => convertToChangeBlock(block, index)), 'id');

export const getBlockChanges = (_newBlocks: BlocksFromEditor, _oldBlocks: Blocks): BlockCategoriesToChange => {
  const newBlocks: BlocksToChange = convertToChangeBlocks(_newBlocks);
  const oldBlocks: BlocksToChange = convertToChangeBlocks(_oldBlocks);

  const blocksToChange: BlockCategoriesToChange = {
    created: {},
    changed: {},
    deleted: {},
  };

  const newKeys = keys(newBlocks);
  const oldKeys = keys(oldBlocks);

  const addedKeys = difference(newKeys, oldKeys);
  const removedKeys = difference(oldKeys, newKeys);
  const commonKeys = difference(newKeys, addedKeys);

  blocksToChange.created = pickBy(newBlocks, (block, key) => includes(addedKeys, key));
  blocksToChange.deleted = pickBy(oldBlocks, (block, key) => includes(removedKeys, key));

  forEach(commonKeys, (key) => {
    if (!isEqual(newBlocks[key], oldBlocks[key])) {
      blocksToChange.changed[key] = newBlocks[key];
    }
  });

  return blocksToChange;
};

export const convertBlockFromEditorJS = (block: _BlockFromEditor, index: number): BlockFromEditor => ({
  ...block,
  position: index,
});

export const convertBlocksFromEditorJS = (blocks: _BlockFromEditor[]): BlocksFromEditor => keyBy(map(blocks, (block, index) => convertBlockFromEditorJS(block, index)), 'id');
export const convertBlocksToEditorJS = (blocks: Blocks): Array<_BlockFromEditor> => map(sortBy(values(blocks), (block) => block.position), (block) => convertBlockToEditorJS(block));

export const convertBlockFromBackend = (block: BlockFromBackend): BlockFromBackend => ({
  ...block,
  position: block.position,
});

export const convertBlocksFromBackend = (blocks: Array<Block>): BlocksFromBackend => {
  const newBlocks = keyBy(map(blocks, convertBlockFromBackend), 'id');
  const positions = map(blocks, (block) => block.position);

  const hasDuplicates = size(uniq(positions)) !== size(positions);

  if (hasDuplicates) {
    // console.log('hasDuplicates', positions, newBlocks);
  }

  // console.log('convertBlocksFromBackend', newBlocks);

  return newBlocks;
};

export const useLocationInfo = (): Object => {
  const location = useLocation();

  return {
    currentRoute: location.pathname,
  };
};

export const useDebounce = (value: any, delay: number = 500): any => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

function MultipleObserver({ children, onView }: any): any {
  const { ref, inView } = useInView({ threshold: 0.6 });

  // if ref is in view, call the onView function
  useEffect(() => {
    if (inView) {
      onView();
    }
  }, [inView, onView]);

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}

export default MultipleObserver;

export const useDebouncedState = (defaultValue: any, onDebounceChange: Function, delay: number = 500): any => {
  const [inputVal, setInputVal] = useState(defaultValue);
  const debouncedValue = useDebounce(inputVal, delay);
  const refValue = useRef(debouncedValue);

  useEffect(() => {
    if (!isEqual(refValue.current, debouncedValue)) {
      refValue.current = debouncedValue;
      onDebounceChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return [
    inputVal,
    setInputVal,
  ];
};

export const useOutsideClickEffect = (
  callback: Function,
  refs: Array<any>,
) => {
  useEffect(() => {
    const handleClick = (e: Event) => {
      if (every(refs, (ref: any) => !ref?.current?.contains(e.target))) {
        callback(e);
      }
    };

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [callback, refs]);
};

export const useScrollTopEffect = () => {
  const locationInfo = useLocationInfo();

  useEffect(() => {
    document.querySelector('.scroll-wrapper')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [locationInfo.currentRoute]);
};

/*
uploadImage(file).then((res) => {
  console.log('upl img', res);
});
*/
export async function uploadImage (file: File): Promise<string> {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '');
  data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '');

  const response = await fetch(`${process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || ''}${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || ''}/image/upload`, {
    method: 'post',
    body: data,
  }).then((res) => res.json());

  return response.url;
}

export function uploadByFile(file: any, type:string):any {
  const data = new FormData();
  data.append(type, file);

  return apiClient.post(`${process.env.REACT_APP_DEV_BACKEND || ''}/api/v1/pubweave/uploads/upload_asset`, data).then((res) => ({
    success: 1,
    file: {
      url: res.data,
    },
  }));
}

export function uploadByUrl(url: any): any {
  return fetch(url).then((res) => res.blob()).then((blob) => {
    const data = new FormData();
    data.append('file', blob);

    return apiClient.post(`${process.env.REACT_APP_DEV_BACKEND || ''}/api/v1/pubweave/uploads/upload_asset`, data).then((res) => ({
      success: 1,
      file: {
        url: res.data,
      },
    }));
  });

  // return new Promise((resolve) => {
  //   resolve({
  //     success: 1,
  //     file: {
  //       url,
  //     },
  //   });
  // });
}
