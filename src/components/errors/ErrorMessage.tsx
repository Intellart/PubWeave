import { get, isString, map } from "lodash";
import { Fragment } from "react/jsx-runtime";

export type ApiError = {
  error: {
    response: {
      status: number;
      statusText: string;
      data:
        | {
            [string: string]: string[];
          }
        | string;
    };
  };
};

function ErrorMessage(props: ApiError) {
  const { error } = props;
  const code = get(error, "response.status", 400);
  const title = get(error, "response.statusText", "Error");
  const detail = get(error, "response.data.message", "Unexpected problem...");

  return (
    <div className="error-wrapper">
      <h3>
        {code} - {title}
      </h3>
      {isString(detail) ? (
        <span title={detail}>{detail.substring(0, 40)}</span>
      ) : (
        map(detail.errors, (errorDesc: any, key: string) => (
          <Fragment key={key}>
            <span>{get(errorDesc, "detail", "")}</span>
            <br />
          </Fragment>
        ))
      )}
    </div>
  );
}

export default ErrorMessage;
