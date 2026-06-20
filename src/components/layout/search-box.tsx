"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

type SearchBoxProps = {
  className?: string;
};

export default function SearchBox({ className }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex h-12 w-full items-stretch overflow-hidden rounded-control border border-keyshop-line bg-white/[0.04]",
        className,
      )}
    >
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-keyshop-muted outline-none"
      />
      <button
        type="submit"
        className="flex items-center gap-2 bg-keyshop-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-keyshop-blue-hover"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Tìm kiếm</span>
      </button>
    </form>
  );
}
