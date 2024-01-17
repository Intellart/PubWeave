// @flow
import React, { useEffect, useState } from 'react';
import { Button, Chip, Modal as MUIModal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  get, invert, isEqual, omit, size,
} from 'lodash';
import {
  faSackDollar, faShare, faUsers, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import ShareModal from './ShareModal';
import CollabModal from './CollabModal';
import { selectors } from '../../store/articleStore';
import { useDebounce } from '../../utils/hooks';
import { selectors as userSelectors } from '../../store/userStore';
import VersioningInfoCard from '../editor/VersioningInfoCard';
import TreasuryModal from './TreasuryModal';

type Props = {
    shape?: 'chip' | 'icon' | 'button',
    text?: 'showAll' | 'showOnline' | 'fillTreasury',
    enabled: boolean,
    isOwner?: boolean,
    type: 'share' | 'collab' | 'versioning' | 'treasury',
    sectionId?: string,
    articleId?: number,
    onClose?: () => void,
    onViewHistory?: () => void,
};

function Modal(props: Props): React$Node {
  const article = useSelector((state) => selectors.article(state), isEqual);
  const articles = useSelector((state) => selectors.getAllArticles(state), isEqual);

  const activeSections = useSelector((state) => selectors.getActiveSections(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const [open, setOpen] = useState(false);
  const onlineNum = useDebounce(size(omit(invert(activeSections), get(user, 'id'))), 1000);

  const collaborators = get(article, 'collaborators') || get(articles, [props.articleId, 'collaborators']);
  const allNum = useDebounce(size(collaborators), 1000);

  useEffect(() => {
    if (!props.shape) {
      setOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.enabled]);

  if (!props.enabled) {
    return null;
  }

  const handleClick = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const renderText = () => {
    const texts = {
      share: {
        showAll: 'Share',
        showOnline: 'Share',
      },
      collab: {
        showAll: `${allNum === 0 ? 'No' : allNum} Collaborators`,
        showOnline: `${onlineNum} Online`,
      },
      versioning: {
        showAll: 'Versioning',
        showOnline: 'Versioning',
      },
      treasury: {
        fillTreasury: 'Fill Treasury',
      },
    };

    return get(texts, [props.type, props.text], '');
  };

  const renderIcon = () => {
    const icons = {
      share: faShare,
      collab: faUsers,
      treasury: faSackDollar,
    };

    return get(icons, props.type, '');
  };

  const chip = (
    <Chip
      icon={<FontAwesomeIcon icon={renderIcon()} />}
      label={renderText()}
      onClick={handleClick}
      variant="default"
      color="warning"
      disabled={open}
    />
  );

  const icon = props.text && onlineNum ? (
    <div
      onClick={handleClick}
      className={classNames('modal-icon-wrapper', { disabled: open })}
    >
      <FontAwesomeIcon
        className="modal-icon-inner"
        icon={renderIcon()}

      />
      <span className="modal-icon-text">{renderText()}</span>
    </div>
  ) : (
    <FontAwesomeIcon
      className={classNames('modal-icon', { disabled: open })}
      icon={renderIcon()}
      onClick={handleClick}
    />
  );

  const renderTitle = () => {
    const titles = {
      share: 'Share',
      collab: 'Collaborators',
      versioning: 'Section info',
      treasury: 'Fill Treasury',
    };

    return get(titles, props.type, '');
  };

  const handleOnClose = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleViewHistory = () => {
    if (props.onViewHistory) {
      props.onViewHistory();
    }

    handleOnClose();
  };

  const getContent = () => {
    if (props.type === 'share') {
      return (
        <ShareModal
          article={article}
        />
      );
    } else if (props.type === 'collab') {
      return (
        <CollabModal
          articleId={get(article, 'id') || props.articleId}
          isOwner={props.isOwner || false}
          collaborators={collaborators}
        />
      );
    } else if (props.type === 'versioning') {
      return (
        <VersioningInfoCard
          sectionId={props.sectionId}
          onViewHistory={handleViewHistory}
          // versionInfo={this.vbInfo}

        />
      );
    } else if (props.type === 'treasury') {
      return (
        <TreasuryModal
          article={article}
          onClose={handleOnClose}
        />
      );
    }
  };

  const btn = (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={open}
    >
      {renderText()}
    </Button>
  );

  return (
    <>
      {props.shape && {
        chip,
        icon,
        button: btn,
      }[props.shape]}
      <MUIModal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={open}
        onClose={handleOnClose}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-inner">
          <div className="modal-header">
            <h2>{renderTitle()}</h2>
            <FontAwesomeIcon
              className="icon"
              icon={faXmark}
              onClick={handleOnClose}
            />
          </div>
          <hr />
          {getContent()}
        </div>
      </MUIModal>
    </>

  );
}

export default Modal;
