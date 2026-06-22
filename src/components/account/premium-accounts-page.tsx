"use client";

import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountListItem,
  AccountLoading,
  accountSelectClass,
} from "@/components/account/account-ui";
import { useSessionQuery } from "@/lib/hooks/use-session-query";
import {
  fetchPremiumAccounts,
  resendPremiumAccounts,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function PremiumAccountsPageClient() {
  const loadAccounts = useCallback(() => fetchPremiumAccounts(), []);
  const { data: accounts, loading } = useSessionQuery(loadAccounts, []);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [productFilter, setProductFilter] = useState("all");

  const productOptions = useMemo(
    () =>
      Array.from(new Set(accounts.map((item) => item.productName).filter(Boolean))).sort(),
    [accounts],
  );

  const filteredAccounts = useMemo(
    () =>
      productFilter === "all"
        ? accounts
        : accounts.filter((item) => item.productName === productFilter),
    [accounts, productFilter],
  );

  const copyText = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`Đã sao chép ${label}`);
  };

  const resend = async (orderId: string) => {
    try {
      await resendPremiumAccounts(orderId);
      toast.success("Đã gửi lại thông tin tài khoản qua email");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể gửi lại"));
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader title="Tài khoản Premium" />

      {accounts.length > 0 ? (
        <div className="mb-6 flex flex-col gap-3 rounded-card border border-keyshop-line bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-keyshop-muted">
            <strong className="text-white">{filteredAccounts.length}</strong> tài khoản
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
        <AccountLoading label="Đang tải tài khoản..." />
      ) : filteredAccounts.length === 0 ? (
        <p className="text-sm text-keyshop-muted">Chưa có tài khoản Premium.</p>
      ) : (
        <div className="space-y-4">
          {filteredAccounts.map((item) => (
            <AccountListItem
              key={item.id}
              action={
                <AccountActionButton onClick={() => resend(item.orderId)}>
                  Gửi lại
                </AccountActionButton>
              }
            >
              <h3 className="text-lg font-bold text-white">{item.productName}</h3>
              <p className="text-sm text-keyshop-muted">Đơn hàng #{item.orderId}</p>
              <div className="space-y-3 pt-1">
                {(item.credentials || []).map((credential, index) => {
                  const usernameKey = `${item.id}-user-${index}`;
                  const passwordKey = `${item.id}-pass-${index}`;

                  return (
                    <div
                      key={usernameKey}
                      className="space-y-2 rounded-control border border-keyshop-line bg-black/20 p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-sky-200">
                        <span className="min-w-0 flex-1 break-all">
                          {visible[usernameKey] ? credential.username : "••••••••"}
                        </span>
                        <button
                          type="button"
                          className="text-xs font-extrabold uppercase text-keyshop-muted hover:text-white"
                          onClick={() =>
                            setVisible({ ...visible, [usernameKey]: !visible[usernameKey] })
                          }
                        >
                          {visible[usernameKey] ? "Ẩn" : "Hiện"}
                        </button>
                        <button
                          type="button"
                          className="text-xs font-extrabold uppercase text-keyshop-blue hover:text-sky-300"
                          onClick={() => copyText(credential.username, "email")}
                        >
                          Email
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-sky-200">
                        <span className="min-w-0 flex-1 break-all">
                          {visible[passwordKey] ? credential.password : "••••••••"}
                        </span>
                        <button
                          type="button"
                          className="text-xs font-extrabold uppercase text-keyshop-muted hover:text-white"
                          onClick={() =>
                            setVisible({ ...visible, [passwordKey]: !visible[passwordKey] })
                          }
                        >
                          {visible[passwordKey] ? "Ẩn" : "Hiện"}
                        </button>
                        <button
                          type="button"
                          className="text-xs font-extrabold uppercase text-keyshop-blue hover:text-sky-300"
                          onClick={() => copyText(credential.password, "mật khẩu")}
                        >
                          Mật khẩu
                        </button>
                      </div>
                      {credential.note ? (
                        <p className="text-xs text-keyshop-muted">Ghi chú: {credential.note}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </AccountListItem>
          ))}
        </div>
      )}
    </AccountCard>
  );
}
