import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get, isEqual, join, split, map, filter, every, size } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { selectors as articleSelectors, actions } from '../../store/articleStore';
import {
  faFacebook,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import classNames from "classnames";
import {
  faCamera,
  faCheck,
  faPencil,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Alert, AlertTitle, Button, Chip } from "@mui/material";
import {
  ConnectWalletButton,
  useCardano,
} from "@cardano-foundation/cardano-connect-with-wallet";
import { getWalletIcon } from "@cardano-foundation/cardano-connect-with-wallet-core";
import {
  emailChecks,
  nameChecks,
  uploadImage,
  usernameChecks,
} from "../../utils/hooks";
import UserSection from "../containers/UserSection";
import UserInfoItem from "../elements/UserInfoItem";
import UserInfoButton from "../elements/UserInfoButton";
import UserInfoInput from "../elements/UserInfoInput";
import Input from "../elements/Input";
import userSelectors from "../../store/user/selectors";
import userActions from "../../store/user/actions";

function UserPage() {
  // const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector(userSelectors.getUser, isEqual);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [avatarImg, setAvatarImg] = useState(get(user, "profile_img"));
  const uploadAvatarRef = useRef<HTMLInputElement | null>(null);

  const userId = get(user, "id") as number;

  // console.log('user', user);
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirm: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    name: "",
    email: "",
    username: "",
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: get(user, "social_fb") || "",
    twitter: get(user, "social_tw") || "",
    linkedin: get(user, "social_ln") || "",
    website: get(user, "social_web") || "",
  });

  useEffect(() => {
    setAvatarImg(get(user, "profile_img"));
    setSocialMedia({
      facebook: get(user, "social_fb") || "",
      twitter: get(user, "social_tw") || "",
      linkedin: get(user, "social_ln") || "",
      website: get(user, "social_web") || "",
    });

    setEditFields({
      name: get(user, "full_name") || "",
      email: get(user, "email") || "",
      username: get(user, "username") || "",
    });
  }, [user]);

  const networkType = import.meta.env.VITE_CARDANO_NETWORK_TYPE || "testnet";

  const {
    // isEnabled,
    isConnected,
    // enabledWallet,
    stakeAddress,
    accountBalance,
    // signMessage,
    usedAddresses,
    enabledWallet,
    // installedExtensions,
    // connect,
    disconnect,
    // connectedCip45Wallet,
  } = useCardano({
    limitNetwork: networkType,
  });

  const dispatch = useDispatch();
  // const createArticle = (userId : number) => dispatch(actions.createArticle(userId));
  const updateUser = (userId: number, payload: any) =>
    dispatch(userActions.updateUser(userId, payload));
  const updateUserPassword = (userId: number, payload: any) =>
    dispatch(userActions.updateUserPassword(userId, payload));

  const handleFileChange = (e: any) => {
    if (!e.target.files) {
      return;
    }

    const file: File = e.target.files[0];

    uploadImage(file).then((url) => {
      console.log("upl img", url);
      updateUser(userId, { profile_img: url });
      setAvatarImg(url as any);
    });
  };

  const setNewAddress = (newValue: string | null) => {
    updateUser(userId, { wallet_address: newValue });
  };

  useEffect(() => {
    console.log("usedAddresses", usedAddresses[0], get(user, "wallet_address"));

    if (
      size(usedAddresses) > 0 &&
      (!get(user, "wallet_address") ||
        get(user, "wallet_address") !== usedAddresses[0])
    ) {
      setNewAddress(usedAddresses[0]);
    }
  }, [usedAddresses[0]]);

  const disconnectWallet = () => {
    setNewAddress(null);
    disconnect();
  };

  const uploadAvatar = () => {
    uploadAvatarRef.current?.click();
  };

  const isEditingName = () => {
    setIsEditing(!isEditing);

    setEditFields({
      name: get(user, "full_name") || "",
      email: get(user, "email") || "",
      username: get(user, "username") || "",
    });
  };

  const clearEditing = () => {
    setIsEditing(!isEditing);
    setEditFields({
      name: get(user, "full_name") || "",
      email: get(user, "email") || "",
      username: get(user, "username") || "",
    });
  };

  const changePassword = () => {
    if (newPassword.password !== newPassword.confirm) {
      toast.error("Passwords do not match");

      return;
    }

    if (newPassword.password === "" || newPassword.confirm === "") {
      toast.error("Password cannot be empty");

      return;
    }

    updateUserPassword(userId, { password: newPassword.password });

    setNewPassword({
      password: "",
      confirm: "",
    });
  };

  const updateUserFields = () => {
    if (
      isEqual(editFields, {
        name: get(user, "full_name"),
        email: get(user, "email"),
        username: get(user, "username"),
      })
    ) {
      return;
    }

    const firstName = split(editFields.name, " ")[0];

    if (firstName !== get(user, "first_name")) {
      updateUser(userId, { first_name: firstName });
    }

    if (split(editFields.name, " ").length > 1) {
      const lastName = join(split(editFields.name, " ").slice(1), " ");

      if (lastName !== get(user, "last_name")) {
        updateUser(userId, { last_name: lastName });
      }
    }

    if (editFields.username !== get(user, "email")) {
      updateUser(userId, { username: editFields.username });
    }

    clearEditing();
  };

  const updateSocialMedia = () => {
    console.log(socialMedia);
    updateUser(userId, {
      social_fb: socialMedia.facebook,
      social_tw: socialMedia.twitter,
      social_ln: socialMedia.linkedin,
      social_web: socialMedia.website,
    });
  };

  const usernameOK = every(usernameChecks, (check) =>
    check.check(editFields.username)
  );
  const emailOK = every(emailChecks, (check) => check.check(editFields.email));
  const nameOK = every(nameChecks, (check) => check.check(editFields.name));

  const isUsernameSame = editFields.username === get(user, "username");
  const isEmailSame = editFields.email === get(user, "email");
  const isNameSame = editFields.name === get(user, "full_name");

  const isOK =
    (!isUsernameSame || !isEmailSame || !isNameSame) &&
    usernameOK &&
    emailOK &&
    nameOK;

  const renderChecks = (checks: any, value: any) =>
    map(
      filter(checks, (check) => !check.check(value)),
      (check, index) => <p key={index}>{check.info}</p>
    );

  const variants = {
    visible: {
      opacity: 1,
      height: "auto",
      visibility: "visible",
      margin: "20px",
      transition: {
        opacity: {
          delay: 0.2,
        },
      },
    },
    hidden: {
      opacity: 0,
      height: 0,
      visibility: "hidden",
      margin: 0,
    },
  };

  return (
    <main className="user-page-wrapper">
      <div className="user-page-wrapper-left">
        <section className="user-page-hero">
          <div className="user-page-header">
            <p className="user-page-header-title">User info</p>
          </div>
          {!isEditing && (
            <div className="user-page-info">
              <input
                type="file"
                ref={uploadAvatarRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="user-page-info-avatar" onClick={uploadAvatar}>
                <FontAwesomeIcon className="icon" icon={faCamera} />
                {avatarImg && <img src={avatarImg} alt="avatar" />}
              </div>

              <div className="user-page-info-text">
                <h1 className="user-page-header-info-name">
                  {get(user, "full_name")}
                </h1>
                <p className="user-page-header-info-email">
                  {get(user, "email")}
                </p>
                <p className={classNames("user-page-header-info-username")}>
                  {get(user, "username") || "No username"}
                </p>
              </div>

              <FontAwesomeIcon
                onClick={() => isEditingName()}
                className="user-page-info-edit-icon"
                icon={faPencil}
              />
            </div>
          )}
          {isEditing && (
            <div className="user-section-wrapper">
              <UserInfoInput
                label="Name"
                value={editFields.name}
                onClick={(e: any) =>
                  setEditFields({ ...editFields, name: e.target.value })
                }
                check={nameOK}
                checkInfo={renderChecks(nameChecks, editFields.name)}
                isValueSame={isNameSame}
              />
              <UserInfoInput
                label="Email"
                value={editFields.email}
                onClick={(e: any) =>
                  setEditFields({ ...editFields, email: e.target.value })
                }
                check={emailOK}
                checkInfo={renderChecks(emailChecks, editFields.email)}
                isValueSame={isEmailSame}
              />

              <UserInfoInput
                label="Username"
                value={editFields.username}
                onClick={(e: any) =>
                  setEditFields({ ...editFields, username: e.target.value })
                }
                check={usernameOK}
                checkInfo={renderChecks(usernameChecks, editFields.username)}
                isValueSame={isUsernameSame}
              />
              <div className="user-section-wrapper-icons">
                <FontAwesomeIcon
                  onClick={() => isOK && updateUserFields()}
                  className={classNames("user-section-wrapper-icons-ok", {
                    "user-section-wrapper-icons-disabled": !isOK,
                  })}
                  icon={faCheck}
                  style={{ color: isOK ? "#00BFA6" : "#BDBDBD" }}
                />
                <FontAwesomeIcon
                  onClick={() => clearEditing()}
                  className="user-section-wrapper-icons-x"
                  icon={faXmark}
                />
              </div>
            </div>
          )}
          <div className="user-section-wrapper">
            {!isEditing &&
              (get(user, "username") === "" || !get(user, "username")) && (
                <Alert
                  severity="warning"
                  sx={{
                    width: "100%",
                    // boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.25)',
                    borderRadius: "5px",
                  }}
                >
                  <p className="user-page-header-info-email">
                    You need to set a username in order to comment on the
                    platform.
                  </p>
                </Alert>
              )}
            {get(user, "orcid_id") && (
              <Input
                label="ORCID"
                value={get(user, "orcid_id") || "N/A"}
                readOnly
              />
            )}
            <Input
              label="Created at"
              value={new Date(
                get(user, "created_at") || ""
              ).toLocaleDateString()}
              readOnly
            />
            <Input
              label="Last updated"
              value={new Date(
                get(user, "updated_at") || ""
              ).toLocaleDateString()}
              readOnly
            />
          </div>
          <div className="user-page-content" />
        </section>
      </div>
      <div className="user-page-wrapper-right">
        <UserSection
          title="Statistics"
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
          variants={variants}
          index={1}
        >
          <UserInfoItem label="Articles" value="0" />
          <UserInfoItem label="Comments" value="0" />
          <UserInfoItem label="Likes" value="0" />
        </UserSection>
        <UserSection
          title="Change password"
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
          variants={variants}
          index={2}
        >
          <UserInfoInput
            label="New password"
            value={newPassword.password}
            onClick={(e: any) =>
              setNewPassword({ ...newPassword, password: e.target.value })
            }
          />
          <UserInfoInput
            label="Confirm new password"
            value={newPassword.confirm}
            onClick={(e: any) =>
              setNewPassword({ ...newPassword, confirm: e.target.value })
            }
          />
          <UserInfoButton label="Change password" onClick={changePassword} />
        </UserSection>
        <UserSection
          title="Social links"
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
          variants={variants}
          index={3}
        >
          <UserInfoInput
            label="Facebook"
            value={socialMedia.facebook}
            onClick={(e: any) =>
              setSocialMedia({ ...socialMedia, facebook: e.target.value })
            }
            icon={faFacebook}
          />
          <UserInfoInput
            label="Twitter"
            value={socialMedia.twitter}
            onClick={(e: any) =>
              setSocialMedia({ ...socialMedia, twitter: e.target.value })
            }
            icon={faTwitter}
          />
          <UserInfoInput
            label="LinkedIn"
            value={socialMedia.linkedin}
            onClick={(e: any) =>
              setSocialMedia({ ...socialMedia, linkedin: e.target.value })
            }
            icon={faLinkedin}
          />
          <UserInfoInput
            label="Personal page"
            value={socialMedia.website}
            onClick={(e: any) =>
              setSocialMedia({ ...socialMedia, website: e.target.value })
            }
          />
          <UserInfoButton
            label="Update social media links"
            onClick={updateSocialMedia}
          />
        </UserSection>
        {get(user, "wallet_address") && !isConnected && (
          <Alert
            severity="info"
            sx={{
              width: "100%",
              borderRadius: "5px",
            }}
          >
            <AlertTitle>
              Address synced with backend, but wallet is not connected
            </AlertTitle>
            <Chip
              label={get(user, "wallet_address")}
              variant="outlined"
              color="info"
              style={{
                width: "100%",
              }}
              onClick={() => {
                navigator.clipboard.writeText(
                  get(user, "wallet_address") || ""
                );
                toast.success("Copied to clipboard");
              }}
            />
          </Alert>
        )}
        {!isConnected && (
          <ConnectWalletButton
            message="Connect wallet"
            limitNetwork={networkType}
            // onSignMessage={(message) => signMessage(message)}
            onConnect={(cip45Wallet) => {
              console.log("cip45Wallet", cip45Wallet);
            }}
            primaryColor="#11273F"
            borderRadius={10}
            showAccountBalance
            customCSS={`
        font-family: Helvetica Light,sans-serif;
        font-size: 0.875rem;
        font-weight: 700;
        width: 100%;
        padding-top: 0;
        font-size: 20px;
        font-weight: 600;
        transition: all 1s ease;

        #connect-wallet-button {
          font-size: 20px;
          font-weight: 600;
          background-color: #fff !important;
          color: #11273F !important;
        }

        #connect-wallet-button:hover {
          transition: all 1s ease;
        }

        #connect-wallet-menu {
          animation: fadein 1s;

          @keyframes fadein {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
        
        max-width: 100%;
        & > span { padding: 5px 16px; }

        & > #connect-wallet-menu {
          transition: all 1s ease;
        }

        `}
          />
        )}
        {isConnected && (
          <UserSection
            title="Wallet"
            titleIcon={getWalletIcon(enabledWallet || "")}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
            variants={variants}
            index={4}
          >
            <Input
              label="Stake address"
              value={stakeAddress || ""}
              readOnly
              helperText="Stake address is a public key used to identify your wallet on the blockchain."
            />
            <Input
              label="Account balance"
              value={`${accountBalance || 0}`}
              readOnly
              currency="₳"
            />
            <Input label="Wallet name" value={enabledWallet || ""} readOnly />
            <hr />
            {map(usedAddresses, (address, index) => (
              <Input
                key={index}
                label="Used address"
                value={address}
                readOnly
                helperText={
                  get(user, "wallet_address")
                    ? "Synced with backend"
                    : "Not synced with backend"
                }
                color={get(user, "wallet_address") ? "success" : "error"}
              />
            ))}
            <Button variant="contained" onClick={disconnectWallet}>
              Disconnect wallet
            </Button>
          </UserSection>
        )}
      </div>
    </main>
  );
}

export default UserPage;
