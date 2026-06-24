"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { COMPANY_NAV_ITEMS, SUPPORT_NAV_GROUP } from "@/lib/navigation/site-nav";
import { getCategoryIcon, getCategoryListingUrl } from "@/lib/utils/category-utils";
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
    <div className="mb-2 border-b border-keyshop-line pb-3">
      <div className="flex min-h-[48px] items-center rounded-control transition-colors hover:bg-white/5">
        <Link
          href={getCategoryListingUrl(category)}
          onClick={onNavigate}
          className="flex flex-1 items-center gap-3 px-3.5 text-sm text-white"
        >
          {icon}
          <span>{title}</span>
        </Link>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="mr-1 flex h-11 w-11 items-center justify-center rounded-lg text-white/70 hover:bg-white/5"
            aria-label={open ? "Thu gọn danh mục" : "Mở rộng danh mục"}
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      {open && items.length > 0 ? (
        <div className="space-y-1 py-1.5 pl-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={getCategoryListingUrl(item)}
              onClick={onNavigate}
              className="flex min-h-[44px] items-center gap-3 rounded-control px-3.5 text-sm text-white/80 hover:bg-white/5"
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

function DrawerLinkSection({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: typeof COMPANY_NAV_ITEMS;
  onNavigate?: () => void;
}) {
  return (
    <div className="mt-6 border-t border-keyshop-line pt-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-keyshop-muted">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex min-h-[44px] items-center gap-3 rounded-control px-3.5 text-sm text-white/80 hover:bg-white/5 hover:text-white"
          >
            <item.icon className="h-4 w-4 shrink-0 text-keyshop-blue" />
            {item.label}
          </Link>
        ))}
      </div>
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
      <div className="mb-4 border-b border-keyshop-line pb-4">
        <h3 className="text-lg font-bold">Tất cả danh mục</h3>
        <p className="mt-1 text-sm text-keyshop-muted">Duyệt theo danh mục sản phẩm</p>
      </div>

      <Link
        href="/products"
        onClick={onNavigate}
        className="mb-4 inline-flex min-h-11 items-center rounded-control bg-keyshop-blue px-4 py-2 text-sm font-semibold text-white hover:bg-keyshop-blue-hover"
      >
        Xem tất cả sản phẩm
      </Link>

      <div>
        {categories.length === 0 ? (
          <p className="text-sm text-keyshop-muted">Chưa có danh mục.</p>
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

      <DrawerLinkSection title="Công ty" items={COMPANY_NAV_ITEMS} onNavigate={onNavigate} />
      <DrawerLinkSection
        title="Hỗ trợ"
        items={SUPPORT_NAV_GROUP.items}
        onNavigate={onNavigate}
      />
    </div>
  );
}
