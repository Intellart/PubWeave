/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
// import MyTable from '../containers/MyTable';
import classNames from "classnames";
import {
  isEmpty,
  isEqual,
  join,
  map,
  size,
  split,
  get,
  some,
  every,
} from "lodash";
import { Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/pubweave_logo.png";
import orcidImg from "../../assets/images/orcid_logo.png";
import { orcidOAuthLink } from "../../utils/hooks";
import { ReduxState } from "../../types";
import userSelectors from "../../store/user/selectors";
import userActions from "../../store/user/actions";

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: HTMLInputElement) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
};

function InputField(props: InputFieldProps) {
  return (
    <div
      className={classNames("input-field-wrapper", props.className, {
        disabled: props.disabled,
        required: props.required,
      })}
    >
      <label className="input-field-label">
        {props.label}{" "}
        {props.required ? (
          <span className="input-field-label-required">*</span>
        ) : (
          <span className="input-field-label-required">(optional)</span>
        )}
      </label>
      <div className="input-field-input-wrapper">
        <input
          type={props.type || "text"}
          placeholder={props.placeholder || props.label}
          name={props.name}
          className="input-field-input"
          value={props.value}
          onChange={(e: any) => props.onChange(e.target)}
        />
      </div>
    </div>
  );
}

type User = {
  email: string;
  password: string;
  domain: string;
};

type Props = {
  forAdmin?: boolean;
};

function RegistrationPage({ forAdmin }: Props) {
  const [orcidId, setOrcidId] = useState("");

  const [registerForm, setRegisterForm] = useState({
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    orcidId: "",
    password: "",
    confirmedPassword: "",
  });

  const navigate = useNavigate();

  const orcidAccount = useSelector((state: ReduxState) =>
    userSelectors.getOrcidAccount(state)
  );

  const dispatch = useDispatch();
  const registerUser = (user: any) => dispatch(userActions.registerUser(user));
  const registerORCIDUser = (user: any) =>
    dispatch(userActions.registerORCIDUser(user));

  const hanldeRegisterFormEdit = (name: string, value: string) => {
    setRegisterForm((regForm) => ({
      ...regForm,
      [name]: value,
    }));
  };

  const hanldeRegisterFormChange = (target: HTMLInputElement) => {
    const { name, value } = target;

    hanldeRegisterFormEdit(name, value);

    if (name === "email") {
      hanldeRegisterFormEdit("userName", value.split("@")[0]);
    }
  };

  const clearForm = () => {
    hanldeRegisterFormEdit("email", "");
    hanldeRegisterFormEdit("password", "");
    hanldeRegisterFormEdit("confirmedPassword", "");
    hanldeRegisterFormEdit("firstName", "");
    hanldeRegisterFormEdit("lastName", "");
  };

  useEffect(() => {
    if (!isEmpty(orcidAccount)) {
      hanldeRegisterFormEdit(
        "email",
        get(orcidAccount, "person.emails.email[0].email", "")
      );
      hanldeRegisterFormEdit(
        "firstName",
        get(orcidAccount, "person.name.given-names.value", "") || ""
      );
      hanldeRegisterFormEdit(
        "lastName",
        get(orcidAccount, "person.name.family-name.value", "")
      );
      setOrcidId(get(orcidAccount, "orcid-identifier.path", ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orcidAccount]);

  const mandatoryFields = [
    "email",
    "password",
    "confirmedPassword",
    "firstName",
  ];

  const checkPasswords = () => [
    {
      rule: !(
        registerForm.password === "" || registerForm.confirmedPassword === ""
      ),
      text: "Can't be empty",
    },
    {
      rule:
        isEqual(registerForm.password, registerForm.confirmedPassword) &&
        !(
          registerForm.password === "" || registerForm.confirmedPassword === ""
        ),
      text: "Password match",
    },
    { rule: size(registerForm.password) >= 6, text: "At least 6 characters" },
    { rule: /\d/g.test(registerForm.password), text: "At least 1 number" },
  ];

  const isPassValid = every(map(checkPasswords(), "rule"));

  const isDisabled =
    some(mandatoryFields, (field) => isEmpty(registerForm[field])) ||
    !isPassValid;

  const handleSubmit = () => {
    if (isDisabled) {
      return;
    }

    // if (password !== confirmedPassword) {
    //   return;
    // }

    registerUser({
      email: registerForm.email,
      password: registerForm.password,
      first_name: registerForm.firstName,
      last_name: registerForm.lastName,
      username: registerForm.userName,
      orcid_id: orcidId,
    });

    clearForm();

    navigate("/login");
  };

  const handleORCIDSubmit = () => {
    window.location.assign(orcidOAuthLink(window.location.pathname));
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!isEmpty(code) && code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log(
        "redirect_uri",
        window.location.origin + window.location.pathname
      );
      console.log("code", code);

      registerORCIDUser({
        code,
        redirect_uri: window.location.origin + window.location.pathname,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="login-page-wrapper">
      <section className="login-section">
        <div className="login-section-left">
          <h1 className="login-section-left-title">Welcome to the PubWeave</h1>
          <p className="login-section-left-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            malesuada, nisl eget aliquam tincidunt, nunc nisl aliquam lorem, nec
            aliquam nisl nunc vel nisl. Sed malesuada, nisl eget aliquam
          </p>
        </div>
        <div className="login-wrapper">
          <div className="login-image-wrapper">
            <img
              src={logoImg}
              alt="PubWeave Logo"
              className="login-image"
              width="40px"
            />
          </div>
          <div className="login-name">
            <h1 className="login-name-title">PubWeave Register</h1>
          </div>
          {!isEmpty(orcidAccount) && (
            <div className="login-email">
              <label htmlFor="full-name" className="login-email-label">
                ORCID ID
              </label>
              <div className="login-email-input-wrapper">
                <input
                  disabled
                  type="text"
                  placeholder="Your full name"
                  className="login-email-input"
                  value={orcidId}
                />
              </div>
              <Alert
                severity="success"
                sx={{
                  marginTop: "10px",
                  padding: "10px",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FontAwesomeIcon icon={faCheck} /> ORCID account connected
              </Alert>
            </div>
          )}
          <InputField
            label="First name"
            value={registerForm.firstName}
            onChange={hanldeRegisterFormChange}
            name="firstName"
            required
          />
          <InputField
            label="Last name"
            value={registerForm.lastName}
            onChange={hanldeRegisterFormChange}
            name="lastName"
          />
          <InputField
            label="Email"
            value={registerForm.email}
            name="email"
            onChange={hanldeRegisterFormChange}
            required
          />
          <InputField
            label="Username"
            name="userName"
            value={registerForm.userName}
            onChange={hanldeRegisterFormChange}
          />
          <InputField
            label="Password"
            name="password"
            value={registerForm.password}
            onChange={hanldeRegisterFormChange}
            type="password"
            required
          />
          <InputField
            label="Confirm Password"
            name="confirmedPassword"
            value={registerForm.confirmedPassword}
            onChange={hanldeRegisterFormChange}
            type="password"
            required
          />

          <Alert
            severity="warning"
            className="login-alert"
            sx={{
              width: "100%",
            }}
          >
            {map(checkPasswords(), (check, index) => (
              <div key={index} className="login-alert-item">
                <FontAwesomeIcon
                  className="login-alert-item-icon"
                  icon={check.rule ? faCheck : faXmark}
                  style={{
                    color: check.rule ? "green" : "red",
                  }}
                />
                {check.text}
              </div>
            ))}
          </Alert>

          {/* <div className="login-forget">
            <a href="/forget" className="login-forget-link">
              Forget Password?
            </a>
          </div> */}
          {!orcidAccount && (
            <button
              onClick={handleORCIDSubmit}
              type="button"
              className={classNames("orcid-login-button")}
            >
              <img
                src={orcidImg}
                alt="ORCID Logo"
                className="orcid-login-image"
                width="40px"
              />
              Register with ORCID
            </button>
          )}

          <button
            onClick={handleSubmit}
            type="button"
            className={classNames("login-button", {
              disabled: isDisabled,
            })}
          >
            Register
          </button>
          <Link
            to="/login"
            onClick={() => clearForm()}
            className="login-signup"
          >
            <p className="login-signup-text">Login</p>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default RegistrationPage;
