"use client";

import { useSession } from "next-auth/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  accountFieldClass,
  accountLabelClass,
  accountSelectClass,
} from "@/components/account/account-ui";
import PasswordSetupPrompt from "@/components/account/password-setup-prompt";
import ProfileAvatarPicker from "@/components/account/profile-avatar-picker";
import { useSessionQuery } from "@/lib/hooks/use-session-query";
import {
  fetchProfile,
  requestEmailChange,
  updateProfile,
  verifyEmailChange,
  type UserProfile,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

function formatDateForInput(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export default function AccountProfilePage() {
  const { data: session, update } = useSession();
  const loadProfile = useCallback(() => fetchProfile(), []);
  const {
    data: profileData,
    loading: loadingInitialProfile,
  } = useSessionQuery<UserProfile | null>(loadProfile, null);

  const [showEmailBox, setShowEmailBox] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [profileFields, setProfileFields] = useState({
    name: "",
    phone: "",
    avatar: "",
    dateOfBirth: "",
    gender: "",
  });

  const [emailFields, setEmailFields] = useState({
    email: "",
    otp: "",
    pendingEmail: "",
  });

  useEffect(() => {
    if (!session?.user) return;

    if (profileData) {
      setProfileFields({
        name: profileData.name || session.user.name || "",
        phone: profileData.phone || "",
        avatar: profileData.avatar || session.user.image || "",
        dateOfBirth: formatDateForInput(profileData.dateOfBirth),
        gender: profileData.gender || "",
      });
      setEmailFields((prev) => ({
        ...prev,
        pendingEmail: profileData.pendingEmail || "",
      }));
      return;
    }

    if (!loadingInitialProfile) {
      setProfileFields({
        name: session.user.name || "",
        phone: "",
        avatar: session.user.image || "",
        dateOfBirth: "",
        gender: "",
      });
    }
  }, [profileData, session, loadingInitialProfile]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoadingProfile(true);
      await updateProfile({
        name: profileFields.name,
        phone: profileFields.phone,
        dateOfBirth: profileFields.dateOfBirth || undefined,
        gender: profileFields.gender,
      });
      await update({ name: profileFields.name.trim() });
      toast.success("Đã cập nhật hồ sơ");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật hồ sơ"));
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleRemoveAvatar() {
    await updateProfile({ avatar: "" });
    setProfileFields((prev) => ({ ...prev, avatar: "" }));
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
      toast.success("Đã gửi mã xác minh");
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
      toast.success("Đã cập nhật email");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoadingEmail(false);
    }
  }

  return (
    <div className="space-y-6">
      <PasswordSetupPrompt profile={profileData} loading={loadingInitialProfile} />

      <ProfileAvatarPicker
        avatar={profileFields.avatar}
        name={profileFields.name}
        email={session?.user?.email || ""}
        disabled={loadingInitialProfile}
        onAvatarChange={(url) =>
          setProfileFields((prev) => ({ ...prev, avatar: url }))
        }
        onAvatarRemove={handleRemoveAvatar}
      />

      <AccountCard>
        <AccountCardHeader
          title="Thông tin cá nhân"
          description="Cập nhật họ tên, liên hệ và thông tin hiển thị trên tài khoản."
        />

        <form onSubmit={handleProfileSubmit} className="grid gap-4 md:grid-cols-2">
          {loadingInitialProfile ? (
            <p className="text-sm text-keyshop-muted md:col-span-2">
              Đang tải hồ sơ...
            </p>
          ) : null}

          <div>
            <label htmlFor="name" className={accountLabelClass}>
              Họ và tên
            </label>
            <input
              id="name"
              value={profileFields.name}
              onChange={(event) =>
                setProfileFields({ ...profileFields, name: event.target.value })
              }
              className={accountFieldClass}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label htmlFor="phone" className={accountLabelClass}>
              Số điện thoại
            </label>
            <input
              id="phone"
              value={profileFields.phone}
              onChange={(event) =>
                setProfileFields({ ...profileFields, phone: event.target.value })
              }
              className={accountFieldClass}
              placeholder="09xx xxx xxx"
            />
          </div>

          <div>
            <label htmlFor="dob" className={accountLabelClass}>
              Ngày sinh
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

          <div>
            <label htmlFor="gender" className={accountLabelClass}>
              Giới tính
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
                Chọn giới tính
              </option>
              <option value="male" className="bg-keyshop-bg">
                Nam
              </option>
              <option value="female" className="bg-keyshop-bg">
                Nữ
              </option>
              <option value="other" className="bg-keyshop-bg">
                Khác
              </option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <AccountActionButton type="submit" disabled={loadingProfile || loadingInitialProfile}>
              {loadingProfile ? "Đang cập nhật..." : "Lưu thông tin"}
            </AccountActionButton>
            <AccountActionButton
              type="button"
              variant="outline"
              onClick={() => setShowEmailBox((value) => !value)}
            >
              Đổi email
            </AccountActionButton>
          </div>
        </form>
      </AccountCard>

      {showEmailBox ? (
        <AccountCard>
          <AccountCardHeader
            title="Đổi email"
            description="Mã xác minh sẽ được gửi tới email mới trước khi thay đổi."
          />
          <div className="space-y-4">
            <form onSubmit={handleEmailRequest} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email mới"
                value={emailFields.email}
                onChange={(event) =>
                  setEmailFields({ ...emailFields, email: event.target.value })
                }
                className={accountFieldClass}
              />
              <AccountActionButton type="submit" disabled={loadingEmail}>
                Gửi mã
              </AccountActionButton>
            </form>

            {emailFields.pendingEmail ? (
              <form onSubmit={handleEmailVerify} className="flex flex-col gap-3 sm:flex-row">
                <input
                  placeholder="Mã 6 chữ số"
                  value={emailFields.otp}
                  onChange={(event) =>
                    setEmailFields({ ...emailFields, otp: event.target.value })
                  }
                  className={accountFieldClass}
                />
                <AccountActionButton type="submit" disabled={loadingEmail}>
                  Xác minh email
                </AccountActionButton>
              </form>
            ) : null}
          </div>
        </AccountCard>
      ) : null}
    </div>
  );
}
