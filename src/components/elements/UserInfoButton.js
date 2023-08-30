// @flow
import classNames from 'classnames';
import React from 'react';

type Props = {
    label: string,
    onClick: () => void,
};

function UserInfoButton({ label, onClick }: Props): React$Node {
  return (
    <div
      className={classNames('user-info-item user-info-item-button')}
      onClick={onClick}
    >
      <p className="user-info-item-title">{label}</p>
    </div>
  );
}

export default UserInfoButton;
