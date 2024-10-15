// @flow
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  isEqual, get, forEach, findKey,
} from 'lodash';
import { selectors } from '../store/articleStore';
import { selectors as userSelectors } from '../store/userStore';

type CriticalSectionProps = {
    blocks: any,
    enabled: boolean,
};

// eslint-disable-next-line no-unused-vars
const useCriticalSections = ({ blocks, enabled } : CriticalSectionProps): { labelCriticalSections: () => void } => {
  const activeSections = useSelector((state) => selectors.getActiveSections(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const blockIdQueue = useSelector((state) => selectors.getBlockIdQueue(state), isEqual);
  const content = useSelector((state) => selectors.articleContent(state), isEqual);

  const labelCriticalSections = () => {
    if (!enabled) return;
    console.log('activeSections', activeSections);
    forEach(document.getElementsByClassName('ce-block__content'), (div, divIndex) => {
      if (div) {
        const sectionKey = findKey(blocks, (o) => o.position === divIndex);
        const isCritical = get(activeSections, sectionKey, null)
        && get(activeSections, sectionKey, null) !== get(user, 'id');

        if (isCritical) {
          div.id = 'critical-section';
          div.onclick = null;
        } else {
          div.id = '';
        }
      }
    });
  };

  useEffect(() => {
    labelCriticalSections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSections, blockIdQueue, content]);

  return { labelCriticalSections };
};

export default useCriticalSections;
