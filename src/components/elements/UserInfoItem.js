// @flow
import classNames from 'classnames';
import { isArray, map, truncate } from 'lodash';
import React from 'react';

type Props = {
    label: string,
    value: string | Array<string>,
    onClick?: (index?: number) => void,
};

function UserInfoItem({ label, value, onClick }: Props): React$Node {
  const isValueArray = isArray(value);

  return (
    <div
      className={classNames('user-info-item',
        {
          'user-info-item-clickable': onClick,
          'user-info-item-array': isValueArray,
        })}
      onClick={!isValueArray ? onClick : undefined}
    >
      <p className="user-info-item-title">{label}</p>
      {isValueArray ? (
        <div
          className="user-info-item-values"
        >
          {map(value, (item, index) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => onClick && onClick(index)}
              key={index}
              className="user-info-item-values-value"
            >
              {truncate(item, { length: 20 })}
            </p>
          ))}
        </div>
      )
        : <p className="user-info-item-value">{truncate(value, { length: 20 })}</p>}
    </div>
  );
}

export default UserInfoItem;
