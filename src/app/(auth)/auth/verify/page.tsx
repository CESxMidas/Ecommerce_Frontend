import VerifyPageClient from "@/components/auth/verify-page";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;

  return <VerifyPageClient email={params.email || ""} />;
}
