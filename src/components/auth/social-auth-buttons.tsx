"use client";

import { getSession, signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { AuthDivider } from "@/components/auth/auth-layout";
import {
  getGoogleClientId,
  loadGoogleIdentityScript,
} from "@/lib/auth/google-identity";
import { cn } from "@/lib/utils";
import { getToastErrorMessage } from "@/lib/utils/toast-error";

function resolveCallbackUrl(callbackUrl: string) {
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/account";
  }

  return callbackUrl;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
      />
    </svg>
  );
}

export default function SocialAuthButtons({
  callbackUrl = "/",
}: {
  callbackUrl?: string;
}) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [googleStatusLoaded, setGoogleStatusLoaded] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const clientId = getGoogleClientId();

  const completeGoogleLogin = useCallback(
    async (credential: string) => {
      try {
        const result = await signIn("credentials", {
          googleCredential: credential,
          googleClientId: clientId,
          redirect: false,
        });

        if (!result?.ok || result?.error) {
          toast.error(getToastErrorMessage(result?.error, "Đăng nhập Google thất bại"));
          return;
        }

        await getSession();
        toast.success("Đăng nhập Google thành công");
        window.location.assign(resolveCallbackUrl(callbackUrl));
      } catch (error) {
        toast.error(getToastErrorMessage(error, "Đăng nhập Google thất bại"));
      }
    },
    [callbackUrl, clientId],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadOAuthStatus() {
      try {
        const response = await fetch("/api/next-auth/oauth-status");
        const data = (await response.json()) as { google?: boolean };

        if (!cancelled) {
          setGoogleEnabled(Boolean(data.google));
        }
      } catch {
        if (!cancelled) {
          setGoogleEnabled(Boolean(clientId));
        }
      } finally {
        if (!cancelled) {
          setGoogleStatusLoaded(true);
        }
      }
    }

    loadOAuthStatus();

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  useEffect(() => {
    if (!googleEnabled || !clientId || !googleButtonRef.current) {
      return;
    }

    let cancelled = false;

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              completeGoogleLogin(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        });

        googleButtonRef.current.replaceChildren();

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "circle",
          width: 56,
        });

        setGoogleReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setGoogleEnabled(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, completeGoogleLogin, googleEnabled]);

  const handleComingSoon = () => {
    toast("Tính năng sắp ra mắt", { icon: "⏳" });
  };

  return (
    <>
      <AuthDivider />
      <div className="flex items-center justify-center gap-4">
        <div
          className={cn(
            "relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-keyshop-line bg-white/[0.04]",
            googleEnabled && googleReady
              ? "hover:border-keyshop-blue/40 hover:bg-keyshop-blue/15"
              : "cursor-not-allowed opacity-50",
          )}
          title={
            googleEnabled
              ? "Tiếp tục với Google"
              : "Chưa cấu hình đăng nhập Google"
          }
        >
          <div
            ref={googleButtonRef}
            className="absolute inset-0 z-10 opacity-[0.01]"
            aria-label="Google"
          />
          <div className="pointer-events-none flex h-full w-full items-center justify-center text-white">
            <GoogleIcon className="h-5 w-5" />
          </div>
          {!googleStatusLoaded || !googleEnabled ? (
            <div className="absolute inset-0 z-20 cursor-not-allowed bg-keyshop-bg/40" />
          ) : null}
        </div>

        <button
          type="button"
          aria-label="GitHub"
          onClick={handleComingSoon}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border border-keyshop-line bg-white/[0.04] text-white transition hover:border-keyshop-blue/40 hover:bg-keyshop-blue/15",
          )}
        >
          <Github className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Discord"
          onClick={handleComingSoon}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-keyshop-line bg-white/[0.04] text-white transition hover:border-keyshop-blue/40 hover:bg-keyshop-blue/15"
        >
          <DiscordIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
