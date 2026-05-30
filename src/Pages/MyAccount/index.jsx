import { useContext, useState } from "react";
import AccountSidebar from "../AccountSidebar";
import { MyContext } from "../../App";
import {
  changePassword,
  updateProfile,
} from "../../services/userService";
import "./index.css";

const MyAccount = () => {
  const context = useContext(MyContext);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [profileFields, setProfileFields] = useState({
    name: context.user?.name || "",
    email: context.user?.email || "",
    phone: context.user?.phone || "",
  });

  const [passwordFields, setPasswordFields] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoadingProfile(true);

      const updated = await updateProfile(profileFields);
      context.updateUser(updated);
      context.openAlertBox("success", "Profile updated");
    } catch {
      context.openAlertBox("error", "Failed to update profile");
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
      setPasswordFields({ password: "", confirmPassword: "" });
      setShowPasswordBox(false);
    } catch {
      context.openAlertBox("error", "Failed to change password");
    } finally {
      setLoadingPassword(false);
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
                    type="email"
                    placeholder="Email"
                    value={profileFields.email}
                    onChange={(event) =>
                      setProfileFields({
                        ...profileFields,
                        email: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="myAccount__formGroup">
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

                <button type="submit" disabled={loadingProfile}>
                  {loadingProfile ? "UPDATING..." : "UPDATE PROFILE"}
                </button>
              </form>
            </div>

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
                      placeholder="New Password"
                      value={passwordFields.password}
                      onChange={(event) =>
                        setPasswordFields({
                          ...passwordFields,
                          password: event.target.value,
                        })
                      }
                    />

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
