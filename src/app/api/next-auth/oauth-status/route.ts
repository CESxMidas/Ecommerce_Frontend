import { NextResponse } from "next/server";

function hasGoogleClientId() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim(),
  );
}

export function GET() {
  const hasClientId = hasGoogleClientId();
  const hasOAuthSecret = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return NextResponse.json({
    google: hasClientId,
    googleOAuthRedirect: hasOAuthSecret,
  });
}
