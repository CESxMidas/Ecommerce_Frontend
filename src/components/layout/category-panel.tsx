"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { getCategoryIcon, getCategoryListingUrl } from "@/lib/utils/category-utils";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/api";

type CategoryChild = Category & {
  label?: string;
  iconNode?: React.ReactNode;
};

function CategoryCollapse({
  title,
  icon,
  category,
  items = [],
  defaultOpen = true,
  onNavigate,
}: {
  title: string;
  icon: React.ReactNode;
  category: Category;
  items?: CategoryChild[];
  defaultOpen?: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-2 border-b border-white/[0.06] pb-2">
      <div className="flex min-h-[50px] items-center rounded-control transition-colors hover:bg-blue-400/10">
        <Link
          href={getCategoryListingUrl(category)}
          onClick={onNavigate}
          className="flex flex-1 items-center gap-2.5 px-3.5 text-sm text-white"
        >
          {icon}
          <span>{title}</span>
        </Link>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="mr-2 rounded-lg p-2 text-white/70 hover:bg-white/5"
            aria-label={open ? "Collapse category" : "Expand category"}
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      {open && items.length > 0 ? (
        <div className="space-y-0.5 py-1 pl-5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={getCategoryListingUrl(item)}
              onClick={onNavigate}
              className="flex min-h-[42px] items-center gap-2.5 rounded-xl px-3.5 text-sm text-white/80 hover:bg-blue-400/10"
            >
              {item.iconNode || getCategoryIcon(item.icon, "h-4 w-4")}
              <span>{item.label || item.name}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type CategoryPanelProps = {
  categories: Category[];
  onNavigate?: () => void;
};

export default function CategoryPanel({ categories, onNavigate }: CategoryPanelProps) {
  return (
    <div className="p-4 text-white">
      <div className="mb-4 border-b border-white/10 pb-4">
        <h3 className="text-lg font-bold">All Categories</h3>
        <p className="mt-1 text-sm text-keyshop-muted">Browse collections by category</p>
      </div>

      <Link
        href="/products"
        onClick={onNavigate}
        className="mb-4 inline-flex rounded-control bg-keyshop-blue px-4 py-2 text-sm font-semibold text-white hover:bg-keyshop-blue-hover"
      >
        View all products
      </Link>

      <div className="mt-2">
        {categories.length === 0 ? (
          <p className="text-sm text-keyshop-muted">No categories available.</p>
        ) : (
          categories.map((category) => {
            const count = (category as Category & { productCount?: number }).productCount;

            return (
              <CategoryCollapse
                key={category.id}
                title={`${category.name}${count ? ` (${count})` : ""}`}
                icon={getCategoryIcon(category.icon)}
                category={category}
                items={(category.children || []).map((child) => ({
                  ...child,
                  label: child.name,
                  iconNode: getCategoryIcon(child.icon, "h-4 w-4"),
                }))}
                onNavigate={onNavigate}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
