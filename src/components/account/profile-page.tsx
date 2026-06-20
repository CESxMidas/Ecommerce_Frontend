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
  fetchProfile,
  requestEmailChange,
  updateProfile,
  verifyEmailChange,
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
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingInitialProfile, setLoadingInitialProfile] = useState(true);
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
    if (!session?.user) {
      setLoadingInitialProfile(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoadingInitialProfile(true);
        const profile = await fetchProfile();

        if (cancelled) return;

        setProfileFields({
          name: profile.name || session.user.name || "",
          phone: profile.phone || "",
          avatar: profile.avatar || session.user.image || "",
          dateOfBirth: formatDateForInput(profile.dateOfBirth),
          gender: profile.gender || "",
        });
      } catch (error) {
        if (!cancelled) {
          setProfileFields({
            name: session.user.name || "",
            phone: "",
            avatar: session.user.image || "",
            dateOfBirth: "",
            gender: "",
          });
          toast.error(getApiErrorMessage(error, "Không thể tải hồ sơ"));
        }
      } finally {
        if (!cancelled) {
          setLoadingInitialProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoadingProfile(true);
      await updateProfile(profileFields);
      await update();
      toast.success("Đã cập nhật hồ sơ");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật hồ sơ"));
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordFields.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (passwordFields.password !== passwordFields.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
      setLoadingPassword(true);
      await changePassword(passwordFields);
      toast.success("Đã đổi mật khẩu");
      setPasswordFields({
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
      setShowPasswordBox(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể đổi mật khẩu"));
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
      <AccountCard>
        <AccountCardHeader
          title="Hồ sơ của tôi"
          description={`Email: ${session?.user?.email || ""}`}
          action={
            <AccountActionButton
              variant="outline"
              onClick={() => setShowPasswordBox((value) => !value)}
            >
              Đổi mật khẩu
            </AccountActionButton>
          }
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
            />
          </div>
          <div>
            <label htmlFor="avatar" className={accountLabelClass}>
              URL ảnh đại diện
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
          <div className="md:col-span-2">
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
              {loadingProfile ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
            </AccountActionButton>
            <AccountActionButton
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
          <AccountCardHeader title="Đổi email" />
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

      {showPasswordBox ? (
        <AccountCard>
          <AccountCardHeader title="Đổi mật khẩu" />
          <form onSubmit={handlePasswordSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
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
              placeholder="Mật khẩu mới"
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
              placeholder="Xác nhận mật khẩu"
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
              {loadingPassword ? "Đang lưu..." : "Đổi mật khẩu"}
            </AccountActionButton>
          </form>
        </AccountCard>
      ) : null}
    </div>
  );
}
