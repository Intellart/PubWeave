// @flow
import React from 'react';
import type { Node } from 'react';
import {
  get, isString, join, map, startCase,
} from 'lodash';

export type ApiError = {
  error: {
    response: {
      status: number,
      statusText: string,
      data: {
        [string: string]: string[]
      } | string,
    },
  }
};

function ErrorMessage(props: ApiError): Node {
  const { error } = props;
  const code = get(error, 'response.status', 400);
  const title = get(error, 'response.statusText', 'Error');
  const detail = get(error, 'response.data', 'Unexpected problem...');

  return (
    <div className="error-wrapper">
      <h3>{code} - {title}</h3>
      {isString(detail) ? (
        <span title={detail}>{detail.substring(0, 40)}</span>
      ) : map(detail, (messages: string | string[], key: string) => (
        <React.Fragment key={key}>
          <span>{startCase(key) + ': ' + isString(messages) ? messages : join(messages, ', ')}</span>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
}

export default ErrorMessage;
