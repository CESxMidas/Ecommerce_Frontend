"use client";

import { MapPin, User } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
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
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formFields, setFormFields] = useState(emptyForm);

  async function loadAddresses() {
    try {
      setLoading(true);
      const data = await fetchAddresses();

      if (Array.isArray(data)) {
        setAddresses(data);
      } else if (Array.isArray(data?.addresses)) {
        setAddresses(data.addresses);
      } else {
        setAddresses([]);
      }
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formFields.address_line.trim() || !formFields.city.trim()) {
      toast.error("Address line and city are required");
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
      toast.error("This address already exists");
      return;
    }

    try {
      setSaving(true);
      await createAddress({
        ...formFields,
        mobile: "",
      });
      setFormFields(emptyForm);
      toast.success("Address added");
      await loadAddresses();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault(addressId: string) {
    try {
      await setDefaultAddress(addressId);
      toast.success("Default address updated");
      await loadAddresses();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleDelete(addressId: string) {
    try {
      await deleteAddress(addressId);
      toast.success("Address removed");
      await loadAddresses();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <AccountCard>
        <AccountCardHeader title="My Addresses" />

        {loading ? (
          <AccountLoading label="Loading addresses..." />
        ) : addresses.length === 0 ? (
          <p className="text-sm text-keyshop-muted">No saved addresses yet.</p>
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
                        {address.label || "Saved address"}
                        {address.isDefault ? (
                          <span className="ml-2 rounded-full bg-keyshop-green/15 px-2 py-0.5 text-xs font-bold text-emerald-300">
                            Default
                          </span>
                        ) : null}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-keyshop-muted">
                        <User className="h-3.5 w-3.5" />
                        {address.fullName || session?.user?.name || "Receiver"}
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
                        Set default
                      </AccountActionButton>
                    ) : null}
                    <AccountActionButton
                      variant="outline"
                      onClick={() => handleDelete(addressId)}
                    >
                      Remove
                    </AccountActionButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AccountCard>

      <AccountCard>
        <AccountCardHeader title="Add new address" />
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={accountLabelClass}>Label</label>
            <input
              value={formFields.label}
              onChange={(event) =>
                setFormFields({ ...formFields, label: event.target.value })
              }
              placeholder="Home, Office"
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>Receiver name</label>
            <input
              value={formFields.fullName}
              onChange={(event) =>
                setFormFields({ ...formFields, fullName: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={accountLabelClass}>Address line</label>
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
            <label className={accountLabelClass}>City</label>
            <input
              value={formFields.city}
              onChange={(event) =>
                setFormFields({ ...formFields, city: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>State</label>
            <input
              value={formFields.state}
              onChange={(event) =>
                setFormFields({ ...formFields, state: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>Pincode</label>
            <input
              value={formFields.pincode}
              onChange={(event) =>
                setFormFields({ ...formFields, pincode: event.target.value })
              }
              className={accountFieldClass}
            />
          </div>
          <div>
            <label className={accountLabelClass}>Country</label>
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
            Set as default address
          </label>
          <AccountActionButton type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add address"}
          </AccountActionButton>
        </form>
      </AccountCard>
    </div>
  );
}
