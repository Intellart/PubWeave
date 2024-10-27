import { useEffect } from "react";
import { useSelector } from "react-redux";
import { isEqual, get, forEach, findKey } from "lodash";
import articleSelectors from "../store/article/selectors";
import userSelectors from "../store/user/selectors";

type CriticalSectionProps = {
  blocks: any;
  enabled: boolean;
};

// eslint-disable-next-line no-unused-vars
const useCriticalSections = ({
  blocks,
  enabled,
}: CriticalSectionProps): { labelCriticalSections: () => void } => {
  const activeSections = useSelector(
    articleSelectors.getActiveSections,
    isEqual
  );
  const user = useSelector(userSelectors.getUser, isEqual);
  const blockIdQueue = useSelector(articleSelectors.getBlockIdQueue, isEqual);
  const content = useSelector(articleSelectors.articleContent, isEqual);

  const labelCriticalSections = () => {
    if (!enabled) return;
    console.log("activeSections", activeSections);
    forEach(
      document.getElementsByClassName("ce-block__content"),
      (div, divIndex) => {
        if (div) {
          const sectionKey = findKey(blocks, (o) => o.position === divIndex);
          const isCritical =
            get(activeSections, sectionKey as string, null) &&
            get(activeSections, sectionKey as string, null) !== get(user, "id");

          if (isCritical) {
            div.id = "critical-section";
            (div as any).onclick = null;
          } else {
            div.id = "";
          }
        }
      }
    );
  };

  useEffect(() => {
    labelCriticalSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSections, blockIdQueue, content]);

  return { labelCriticalSections };
};

export default useCriticalSections;
