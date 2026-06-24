"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Category } from "@/types/api";

type ListingSidebarProps = {
  categories: Category[];
  brands: string[];
  selectedCategoryIds: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  priceBounds: [number, number];
  onCategoryChange: (ids: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
};

function getCategoryIds(category: Category): string[] {
  return [
    String(category.id),
    ...(category.children || []).flatMap(getCategoryIds),
  ];
}

export default function ListingSidebar({
  categories,
  brands,
  selectedCategoryIds,
  selectedBrands,
  priceRange,
  priceBounds,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
}: ListingSidebarProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
  });

  const toggleCategory = (category: Category) => {
    const ids = getCategoryIds(category);
    const allSelected = ids.every((id) => selectedCategoryIds.includes(id));

    if (allSelected) {
      onCategoryChange(selectedCategoryIds.filter((item) => !ids.includes(item)));
    } else {
      onCategoryChange(Array.from(new Set([...selectedCategoryIds, ...ids])));
    }
  };

  const renderCategoryOptions = (items: Category[], depth = 0): ReactNode[] =>
    items.flatMap((category) => {
      const ids = getCategoryIds(category);
      const allSelected = ids.every((id) => selectedCategoryIds.includes(id));
      const someSelected =
        ids.some((id) => selectedCategoryIds.includes(id)) && !allSelected;
      const count = (category as Category & { productCount?: number }).productCount;

      return [
        <label
          key={category.id}
          className="flex min-h-11 cursor-pointer items-start gap-3 rounded-control px-3 py-2 hover:bg-white/5"
          style={{ marginLeft: depth * 12 }}
        >
          <input
            type="checkbox"
            className="mt-1"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={() => toggleCategory(category)}
          />
          <span className="text-sm text-white/85">
            {category.name}
            {count ? <em className="ml-1 not-italic text-keyshop-muted">({count})</em> : null}
          </span>
        </label>,
        ...renderCategoryOptions(category.children || [], depth + 1),
      ];
    });

  return (
    <aside className="space-y-4">
      <FilterSection
        title="Danh mục"
        open={openSections.categories}
        onToggle={() =>
          setOpenSections((prev) => ({ ...prev, categories: !prev.categories }))
        }
      >
        <div className="space-y-1">
          {categories.length === 0 ? (
            <p className="text-sm text-keyshop-muted">Chưa có danh mục</p>
          ) : (
            renderCategoryOptions(categories)
          )}
        </div>
      </FilterSection>

      <FilterSection
        title="Thương hiệu"
        open={openSections.brands}
        onToggle={() => setOpenSections((prev) => ({ ...prev, brands: !prev.brands }))}
      >
        <div className="space-y-1">
          {brands.length === 0 ? (
            <p className="text-sm text-keyshop-muted">Chưa có thương hiệu</p>
          ) : (
            brands.map((brand) => (
              <label
                key={brand}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control px-3 py-2 hover:bg-white/5"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() =>
                    onBrandChange(
                      selectedBrands.includes(brand)
                        ? selectedBrands.filter((item) => item !== brand)
                        : [...selectedBrands, brand],
                    )
                  }
                />
                <span className="text-sm text-white/85">{brand}</span>
              </label>
            ))
          )}
        </div>
      </FilterSection>

      <FilterSection
        title="Giá"
        open={openSections.price}
        onToggle={() => setOpenSections((prev) => ({ ...prev, price: !prev.price }))}
      >
        <div className="space-y-4 px-1">
          <input
            type="range"
            min={priceBounds[0]}
            max={priceBounds[1]}
            value={priceRange[0]}
            onChange={(event) =>
              onPriceChange([Number(event.target.value), priceRange[1]])
            }
            className="w-full accent-keyshop-blue"
          />
          <input
            type="range"
            min={priceBounds[0]}
            max={priceBounds[1]}
            value={priceRange[1]}
            onChange={(event) =>
              onPriceChange([priceRange[0], Number(event.target.value)])
            }
            className="w-full accent-keyshop-blue"
          />
          <div className="flex items-center justify-between text-sm text-keyshop-muted">
            <span>{priceRange[0].toLocaleString("vi-VN")}₫</span>
            <span>{priceRange[1].toLocaleString("vi-VN")}₫</span>
          </div>
        </div>
      </FilterSection>
    </aside>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-keyshop-line bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-left"
      >
        <h3 className="font-semibold text-white">{title}</h3>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open ? <div className="border-t border-keyshop-line px-3 py-3">{children}</div> : null}
    </div>
  );
}
