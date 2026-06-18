import { useContext, useState, useEffect } from "react";
import AccountSidebar from "../AccountSidebar";
import { MyContext } from "../../App";
import {
  changePassword,
  requestEmailChange,
  updateProfile,
  verifyEmailChange,
} from "../../services/userService";
import "./index.css";

const MyAccount = () => {
  const context = useContext(MyContext);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [profileFields, setProfileFields] = useState({
    name: context.user?.name || "",
    phone: context.user?.phone || "",
    avatar: context.user?.avatar || "",
    dateOfBirth: context.user?.dateOfBirth
      ? String(context.user.dateOfBirth).slice(0, 10)
      : "",
    gender: context.user?.gender || "",
  });

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [emailFields, setEmailFields] = useState({
    email: "",
    otp: "",
    pendingEmail: context.user?.pendingEmail || "",
  });

  useEffect(() => {
    if (context.user) {
      const timer = setTimeout(() => {
        setProfileFields({
          name: context.user.name || "",
          phone: context.user.phone || "",
          avatar: context.user.avatar || "",
          dateOfBirth: context.user.dateOfBirth
            ? String(context.user.dateOfBirth).slice(0, 10)
            : "",
          gender: context.user.gender || "",
        });
      }, 0);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [context.user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoadingProfile(true);

      const updated = await updateProfile(profileFields);
      context.updateUser(updated);
      context.openAlertBox("success", "Profile updated");
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Failed to update profile",
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordFields.password.length < 6) {
      context.openAlertBox(
        "error",
        "Password must be at least 6 characters"
      );
      return;
    }

    if (passwordFields.password !== passwordFields.confirmPassword) {
      context.openAlertBox("error", "Passwords do not match");
      return;
    }

    try {
      setLoadingPassword(true);

      await changePassword(passwordFields);
      context.openAlertBox("success", "Password changed");
      setPasswordFields({
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
      setShowPasswordBox(false);
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Failed to change password",
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleEmailRequest = async (event) => {
    event.preventDefault();

    try {
      setLoadingEmail(true);
      const result = await requestEmailChange(emailFields.email);
      setEmailFields({
        ...emailFields,
        pendingEmail: result.pendingEmail || emailFields.email,
      });
      context.openAlertBox("success", "Verification code sent");
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Failed to request email change",
      );
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleEmailVerify = async (event) => {
    event.preventDefault();

    try {
      setLoadingEmail(true);
      const updated = await verifyEmailChange({ otp: emailFields.otp });
      context.updateUser(updated);
      setEmailFields({ email: "", otp: "", pendingEmail: "" });
      setShowEmailBox(false);
      context.openAlertBox("success", "Email updated");
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Failed to verify email",
      );
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <section className="myAccount">
      <div className="container">
        <div className="myAccount__wrapper">
          <AccountSidebar />

          <div className="myAccount__content">
            <div className="myAccount__card">
              <div className="myAccount__header">
                <h2>My Profile</h2>

                <button
                  type="button"
                  onClick={() => setShowPasswordBox(!showPasswordBox)}
                >
                  CHANGE PASSWORD
                </button>
              </div>

              <p style={{ color: "#94a3b8", marginBottom: 18 }}>
                Email: {context.user?.email}{" "}
                {context.user?.verify_email ? "(verified)" : "(not verified)"}
              </p>

              <div className="myAccount__summaryGrid">
                <div className="myAccount__summaryItem">
                  <span>Email Status</span>
                  <strong>
                    {context.user?.verify_email ? "Verified" : "Not verified"}
                  </strong>
                </div>
                <div className="myAccount__summaryItem">
                  <span>Security</span>
                  <strong>
                    {context.user?.twoFactorEnabled ? "2FA enabled" : "Standard"}
                  </strong>
                </div>
                <div className="myAccount__summaryItem">
                  <span>Profile</span>
                  <strong>
                    {profileFields.phone && profileFields.dateOfBirth
                      ? "Complete"
                      : "Needs info"}
                  </strong>
                </div>
              </div>

              <form
                className="myAccount__form"
                onSubmit={handleProfileSubmit}
              >
                <div className="myAccount__formGroup">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={profileFields.name}
                    onChange={(event) =>
                      setProfileFields({
                        ...profileFields,
                        name: event.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={profileFields.phone}
                    onChange={(event) =>
                      setProfileFields({
                        ...profileFields,
                        phone: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="myAccount__formGroup">
                  <input
                    type="text"
                    placeholder="Avatar URL"
                    value={profileFields.avatar}
                    onChange={(event) =>
                      setProfileFields({
                        ...profileFields,
                        avatar: event.target.value,
                      })
                    }
                  />

                  <input
                    type="date"
                    value={profileFields.dateOfBirth}
                    onChange={(event) =>
                      setProfileFields({
                        ...profileFields,
                        dateOfBirth: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="myAccount__formGroup">
                  <select
                    value={profileFields.gender}
                    onChange={(event) =>
                      setProfileFields({
                        ...profileFields,
                        gender: event.target.value,
                      })
                    }
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button type="submit" disabled={loadingProfile}>
                  {loadingProfile ? "UPDATING..." : "UPDATE PROFILE"}
                </button>
                <button
                  type="button"
                  disabled={loadingProfile}
                  style={{ marginLeft: 12 }}
                  onClick={() => setShowEmailBox(!showEmailBox)}
                >
                  CHANGE EMAIL
                </button>
              </form>
            </div>

            {showEmailBox && (
              <div className="myAccount__card">
                <div className="myAccount__header">
                  <h2>Change Email</h2>
                </div>

                <form className="myAccount__form" onSubmit={handleEmailRequest}>
                  <div className="myAccount__formGroup">
                    <input
                      type="email"
                      placeholder="New email"
                      value={emailFields.email}
                      onChange={(event) =>
                        setEmailFields({
                          ...emailFields,
                          email: event.target.value,
                        })
                      }
                    />
                    <button type="submit" disabled={loadingEmail}>
                      SEND CODE
                    </button>
                  </div>
                </form>

                {(emailFields.pendingEmail || context.user?.pendingEmail) && (
                  <form className="myAccount__form" onSubmit={handleEmailVerify}>
                    <p style={{ color: "#94a3b8", marginBottom: 14 }}>
                      Code sent to{" "}
                      {emailFields.pendingEmail || context.user?.pendingEmail}
                    </p>
                    <div className="myAccount__formGroup">
                      <input
                        type="text"
                        placeholder="6-digit code"
                        value={emailFields.otp}
                        onChange={(event) =>
                          setEmailFields({
                            ...emailFields,
                            otp: event.target.value,
                          })
                        }
                      />
                      <button type="submit" disabled={loadingEmail}>
                        VERIFY EMAIL
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {showPasswordBox && (
              <div className="myAccount__card">
                <div className="myAccount__header">
                  <h2>Change Password</h2>
                </div>

                <form
                  className="myAccount__form"
                  onSubmit={handlePasswordSubmit}
                >
                  <div className="myAccount__formGroup">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={passwordFields.currentPassword}
                      onChange={(event) =>
                        setPasswordFields({
                          ...passwordFields,
                          currentPassword: event.target.value,
                        })
                      }
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordFields.password}
                      onChange={(event) =>
                        setPasswordFields({
                          ...passwordFields,
                          password: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="myAccount__formGroup">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={passwordFields.confirmPassword}
                      onChange={(event) =>
                        setPasswordFields({
                          ...passwordFields,
                          confirmPassword: event.target.value,
                        })
                      }
                    />
                  </div>

                  <button type="submit" disabled={loadingPassword}>
                    {loadingPassword ? "SAVING..." : "CHANGE PASSWORD"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
