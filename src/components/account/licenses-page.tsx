"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountListItem,
  AccountLoading,
  accountSelectClass,
} from "@/components/account/account-ui";
import {
  fetchLicenses,
  resendLicenseKeys,
  type LicenseEntry,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function LicensesPageClient() {
  const [licenses, setLicenses] = useState<LicenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [productFilter, setProductFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchLicenses();
        if (!cancelled) setLicenses(data);
      } catch {
        if (!cancelled) setLicenses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const productOptions = useMemo(
    () => Array.from(new Set(licenses.map((item) => item.productName).filter(Boolean))).sort(),
    [licenses],
  );

  const filteredLicenses = useMemo(
    () =>
      productFilter === "all"
        ? licenses
        : licenses.filter((item) => item.productName === productFilter),
    [licenses, productFilter],
  );

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    toast.success("Đã sao chép mã bản quyền");
  };

  const resend = async (orderId: string) => {
    try {
      await resendLicenseKeys(orderId);
      toast.success("Đã gửi lại mã bản quyền qua email");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể gửi lại mã"));
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader title="Mã bản quyền" />

      {licenses.length > 0 ? (
        <div className="mb-6 flex flex-col gap-3 rounded-card border border-keyshop-line bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-keyshop-muted">
            <strong className="text-white">{filteredLicenses.length}</strong> mã
            bản quyền
          </div>
          <select
            value={productFilter}
            onChange={(event) => setProductFilter(event.target.value)}
            className={accountSelectClass}
          >
            <option value="all" className="bg-keyshop-bg">
              Tất cả sản phẩm
            </option>
            {productOptions.map((productName) => (
              <option key={productName} value={productName} className="bg-keyshop-bg">
                {productName}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {loading ? (
        <AccountLoading label="Đang tải mã bản quyền..." />
      ) : filteredLicenses.length === 0 ? (
        <p className="text-sm text-keyshop-muted">Chưa có mã bản quyền.</p>
      ) : (
        <div className="space-y-4">
          {filteredLicenses.map((item) => (
            <AccountListItem
              key={item.id}
              action={
                <AccountActionButton onClick={() => resend(item.orderId)}>
                  Gửi lại
                </AccountActionButton>
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-white">{item.productName}</h3>
                {item.variant?.name ? (
                  <span className="rounded-full bg-keyshop-blue/15 px-2.5 py-1 text-xs font-bold text-sky-300">
                    {item.variant.name}
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-keyshop-muted">Đơn hàng #{item.orderId}</p>
              <div className="space-y-2 pt-1">
                {(item.keys || []).map((key) => (
                  <div
                    key={key}
                    className="flex flex-wrap items-center gap-2 rounded-control border border-keyshop-line bg-black/20 px-3 py-2 font-mono text-sm text-sky-200"
                  >
                    <span className="min-w-0 flex-1 break-all">
                      {visible[key] ? key : "****-*****"}
                    </span>
                    <button
                      type="button"
                      className="text-xs font-extrabold uppercase text-keyshop-muted hover:text-white"
                      onClick={() => setVisible({ ...visible, [key]: !visible[key] })}
                    >
                      {visible[key] ? "Ẩn" : "Hiện"}
                    </button>
                    <button
                      type="button"
                      className="text-xs font-extrabold uppercase text-keyshop-blue hover:text-sky-300"
                      onClick={() => copyKey(key)}
                    >
                      Sao chép
                    </button>
                  </div>
                ))}
              </div>
            </AccountListItem>
          ))}
        </div>
      )}
    </AccountCard>
  );
}
