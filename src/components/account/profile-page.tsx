"use client";

import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  accountFieldClass,
  accountLabelClass,
  accountSelectClass,
} from "@/components/account/account-ui";
import {
  changePassword,
  requestEmailChange,
  updateProfile,
  verifyEmailChange,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function AccountProfilePage() {
  const { data: session, update } = useSession();
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [profileFields, setProfileFields] = useState({
    name: "",
    phone: "",
    avatar: "",
    dateOfBirth: "",
    gender: "",
  });

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [emailFields, setEmailFields] = useState({
    email: "",
    otp: "",
    pendingEmail: "",
  });

  useEffect(() => {
    if (!session?.user) return;

    setProfileFields({
      name: session.user.name || "",
      phone: "",
      avatar: session.user.image || "",
      dateOfBirth: "",
      gender: "",
    });
  }, [session?.user]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoadingProfile(true);
      await updateProfile(profileFields);
      await update();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile"));
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordFields.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (passwordFields.password !== passwordFields.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoadingPassword(true);
      await changePassword(passwordFields);
      toast.success("Password changed");
      setPasswordFields({
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
      setShowPasswordBox(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to change password"));
    } finally {
      setLoadingPassword(false);
    }
  }

  async function handleEmailRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoadingEmail(true);
      const result = await requestEmailChange(emailFields.email);
      setEmailFields({
        ...emailFields,
        pendingEmail: result.pendingEmail || emailFields.email,
      });
      toast.success("Verification code sent");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoadingEmail(false);
    }
  }

  async function handleEmailVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoadingEmail(true);
      await verifyEmailChange({ otp: emailFields.otp });
      setEmailFields({ email: "", otp: "", pendingEmail: "" });
      setShowEmailBox(false);
      await update();
      toast.success("Email updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoadingEmail(false);
    }
  }

  return (
    <div className="space-y-6">
      <AccountCard>
        <AccountCardHeader
          title="My Profile"
          description={`Email: ${session?.user?.email || ""}`}
          action={
            <AccountActionButton
              variant="outline"
              onClick={() => setShowPasswordBox((value) => !value)}
            >
              Change password
            </AccountActionButton>
          }
        />

        <form onSubmit={handleProfileSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className={accountLabelClass}>
              Full name
            </label>
            <input
              id="name"
              value={profileFields.name}
              onChange={(event) =>
                setProfileFields({ ...profileFields, name: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className={accountLabelClass}>
              Phone
            </label>
            <input
              id="phone"
              value={profileFields.phone}
              onChange={(event) =>
                setProfileFields({ ...profileFields, phone: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label htmlFor="avatar" className={accountLabelClass}>
              Avatar URL
            </label>
            <input
              id="avatar"
              value={profileFields.avatar}
              onChange={(event) =>
                setProfileFields({ ...profileFields, avatar: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label htmlFor="dob" className={accountLabelClass}>
              Date of birth
            </label>
            <input
              id="dob"
              type="date"
              value={profileFields.dateOfBirth}
              onChange={(event) =>
                setProfileFields({
                  ...profileFields,
                  dateOfBirth: event.target.value,
                })
              }
              className={accountFieldClass}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="gender" className={accountLabelClass}>
              Gender
            </label>
            <select
              id="gender"
              className={accountSelectClass}
              value={profileFields.gender}
              onChange={(event) =>
                setProfileFields({ ...profileFields, gender: event.target.value })
              }
            >
              <option value="" className="bg-keyshop-bg">
                Select gender
              </option>
              <option value="male" className="bg-keyshop-bg">
                Male
              </option>
              <option value="female" className="bg-keyshop-bg">
                Female
              </option>
              <option value="other" className="bg-keyshop-bg">
                Other
              </option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <AccountActionButton type="submit" disabled={loadingProfile}>
              {loadingProfile ? "Updating..." : "Update profile"}
            </AccountActionButton>
            <AccountActionButton
              variant="outline"
              onClick={() => setShowEmailBox((value) => !value)}
            >
              Change email
            </AccountActionButton>
          </div>
        </form>
      </AccountCard>

      {showEmailBox ? (
        <AccountCard>
          <AccountCardHeader title="Change email" />
          <div className="space-y-4">
            <form onSubmit={handleEmailRequest} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="New email"
                value={emailFields.email}
                onChange={(event) =>
                  setEmailFields({ ...emailFields, email: event.target.value })
                }
                className={accountFieldClass}
              />
              <AccountActionButton type="submit" disabled={loadingEmail}>
                Send code
              </AccountActionButton>
            </form>

            {emailFields.pendingEmail ? (
              <form onSubmit={handleEmailVerify} className="flex flex-col gap-3 sm:flex-row">
                <input
                  placeholder="6-digit code"
                  value={emailFields.otp}
                  onChange={(event) =>
                    setEmailFields({ ...emailFields, otp: event.target.value })
                  }
                  className={accountFieldClass}
                />
                <AccountActionButton type="submit" disabled={loadingEmail}>
                  Verify email
                </AccountActionButton>
              </form>
            ) : null}
          </div>
        </AccountCard>
      ) : null}

      {showPasswordBox ? (
        <AccountCard>
          <AccountCardHeader title="Change password" />
          <form onSubmit={handlePasswordSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="password"
              placeholder="Current password"
              value={passwordFields.currentPassword}
              onChange={(event) =>
                setPasswordFields({
                  ...passwordFields,
                  currentPassword: event.target.value,
                })
              }
              className={accountFieldClass}
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordFields.password}
              onChange={(event) =>
                setPasswordFields({
                  ...passwordFields,
                  password: event.target.value,
                })
              }
              className={accountFieldClass}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={passwordFields.confirmPassword}
              onChange={(event) =>
                setPasswordFields({
                  ...passwordFields,
                  confirmPassword: event.target.value,
                })
              }
              className={`md:col-span-2 ${accountFieldClass}`}
            />
            <AccountActionButton type="submit" disabled={loadingPassword}>
              {loadingPassword ? "Saving..." : "Change password"}
            </AccountActionButton>
          </form>
        </AccountCard>
      ) : null}
    </div>
  );
}
