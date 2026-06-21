"use client";

import { MapPin, User } from "lucide-react";
import { FormEvent, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountLoading,
  accountFieldClass,
  accountLabelClass,
} from "@/components/account/account-ui";
import { useSessionQuery } from "@/lib/hooks/use-session-query";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
} from "@/lib/services/user-service";
import type { UserAddress } from "@/types/cart";
import { getApiErrorMessage } from "@/lib/utils/api-error";

const emptyForm = {
  label: "",
  fullName: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  isDefault: false,
};

export default function AddressesPageClient() {
  const { data: session } = useSession();
  const loadAddresses = useCallback(async () => {
    const data = await fetchAddresses();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.addresses)) return data.addresses;
    return [];
  }, []);
  const {
    data: addresses,
    loading,
    reload: loadAddressesPage,
  } = useSessionQuery<UserAddress[]>(loadAddresses, []);
  const [saving, setSaving] = useState(false);
  const [formFields, setFormFields] = useState(emptyForm);

  async function reloadAddresses() {
    await loadAddressesPage();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formFields.address_line.trim() || !formFields.city.trim()) {
      toast.error("Địa chỉ và thành phố là bắt buộc");
      return;
    }

    const isDuplicate = addresses.some(
      (address) =>
        address.address_line?.trim().toLowerCase() ===
          formFields.address_line.trim().toLowerCase() &&
        address.city?.trim().toLowerCase() ===
          formFields.city.trim().toLowerCase(),
    );

    if (isDuplicate) {
      toast.error("Địa chỉ này đã tồn tại");
      return;
    }

    try {
      setSaving(true);
      await createAddress({
        ...formFields,
        mobile: "",
      });
      setFormFields(emptyForm);
      toast.success("Đã thêm địa chỉ");
      await reloadAddresses();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault(addressId: string) {
    try {
      await setDefaultAddress(addressId);
      toast.success("Đã cập nhật địa chỉ mặc định");
      await reloadAddresses();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleDelete(addressId: string) {
    try {
      await deleteAddress(addressId);
      toast.success("Đã xóa địa chỉ");
      await reloadAddresses();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <AccountCard>
        <AccountCardHeader title="Địa chỉ của tôi" />

        {loading ? (
          <AccountLoading label="Đang tải địa chỉ..." />
        ) : addresses.length === 0 ? (
          <p className="text-sm text-keyshop-muted">Chưa có địa chỉ đã lưu.</p>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => {
              const addressId = String(address.id || address._id);

              return (
                <div
                  key={addressId}
                  className="flex flex-col gap-4 rounded-card border border-keyshop-line bg-white/[0.02] p-4 md:flex-row md:items-start md:justify-between"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-keyshop-blue/15 text-keyshop-blue">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        {address.label || "Địa chỉ đã lưu"}
                        {address.isDefault ? (
                          <span className="ml-2 rounded-full bg-keyshop-green/15 px-2 py-0.5 text-xs font-bold text-emerald-300">
                            Mặc định
                          </span>
                        ) : null}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-keyshop-muted">
                        <User className="h-3.5 w-3.5" />
                        {address.fullName || session?.user?.name || "Người nhận"}
                      </p>
                      <p className="mt-2 text-sm text-keyshop-muted">
                        {address.address_line}, {address.city}
                        {address.state ? `, ${address.state}` : ""}
                        {address.pincode ? ` ${address.pincode}` : ""}
                        {address.country ? `, ${address.country}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!address.isDefault ? (
                      <AccountActionButton
                        variant="outline"
                        onClick={() => handleSetDefault(addressId)}
                      >
                        Đặt mặc định
                      </AccountActionButton>
                    ) : null}
                    <AccountActionButton
                      variant="outline"
                      onClick={() => handleDelete(addressId)}
                    >
                      Xóa
                    </AccountActionButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AccountCard>

      <AccountCard>
        <AccountCardHeader title="Thêm địa chỉ mới" />
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={accountLabelClass}>Nhãn</label>
            <input
              value={formFields.label}
              onChange={(event) =>
                setFormFields({ ...formFields, label: event.target.value })
              }
              placeholder="Nhà, Văn phòng"
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>Tên người nhận</label>
            <input
              value={formFields.fullName}
              onChange={(event) =>
                setFormFields({ ...formFields, fullName: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={accountLabelClass}>Địa chỉ</label>
            <input
              value={formFields.address_line}
              onChange={(event) =>
                setFormFields({
                  ...formFields,
                  address_line: event.target.value,
                })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>Thành phố</label>
            <input
              value={formFields.city}
              onChange={(event) =>
                setFormFields({ ...formFields, city: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>Tỉnh/Thành</label>
            <input
              value={formFields.state}
              onChange={(event) =>
                setFormFields({ ...formFields, state: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>Mã bưu điện</label>
            <input
              value={formFields.pincode}
              onChange={(event) =>
                setFormFields({ ...formFields, pincode: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>Quốc gia</label>
            <input
              value={formFields.country}
              onChange={(event) =>
                setFormFields({ ...formFields, country: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-keyshop-muted md:col-span-2">
            <input
              type="checkbox"
              checked={formFields.isDefault}
              onChange={(event) =>
                setFormFields({
                  ...formFields,
                  isDefault: event.target.checked,
                })
              }
              className="accent-keyshop-blue"
            />
            Đặt làm địa chỉ mặc định
          </label>
          <AccountActionButton type="submit" disabled={saving}>
            {saving ? "Đang lưu..." : "Thêm địa chỉ"}
          </AccountActionButton>
        </form>
      </AccountCard>
    </div>
  );
}
