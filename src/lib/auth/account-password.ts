import type { UserProfile } from "@/lib/services/user-service";

export function isGoogleOnlyAccount(
  profile?: Pick<UserProfile, "hasPassword" | "authProvider"> | null,
) {
  if (!profile) return false;
  return !profile.hasPassword && profile.authProvider === "google";
}

export function isGoogleOnlyLoginError(message?: string | null) {
  return Boolean(message && /đăng nhập bằng google/i.test(message));
}
