import {
  faCircleCheck,
  faCircleXmark,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert } from "@mui/material";
import classNames from "classnames";

type Props = {
  label: string;
  value: string | Array<string>;
  onClick: (e: any) => void;
  icon?: IconDefinition;
  check?: boolean;
  checkInfo?: any;
  isValueSame?: boolean;
  type?: string;
  after?: string;
};

function UserInfoInput({
  label,
  value,
  onClick,
  icon,
  check,
  checkInfo,
  isValueSame,
  type,
  after,
}: Props) {
  return (
    <>
      <div className={classNames("user-info-item")}>
        <p className="user-info-item-title">
          {icon ? <FontAwesomeIcon icon={icon} /> : null}
          {label}
        </p>
        <input
          className={classNames(
            "user-info-item-value user-info-item-value-input",
            type === "date" ? "user-info-item-value-input-date" : null
          )}
          value={value}
          onChange={onClick}
          placeholder={label}
          type={type || "text"}
        />
        {after && <p className="user-info-item-after">{after}</p>}
        {check !== undefined && (
          <div className="user-info-item-checks-wrapper">
            <FontAwesomeIcon
              className={classNames("user-info-item-checks-icon")}
              icon={check ? faCircleCheck : faCircleXmark}
              // eslint-disable-next-line no-nested-ternary
              style={{ color: isValueSame ? "grey" : check ? "green" : "red" }}
            />
          </div>
        )}
      </div>
      {!check && check !== undefined && (
        <Alert
          severity="warning"
          sx={{
            width: "100%",
            // boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.25)',
            borderRadius: "5px",
          }}
        >
          {checkInfo}
        </Alert>
      )}
    </>
  );
}

export default UserInfoInput;
