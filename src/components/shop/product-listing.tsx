"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Filter,
  Grid2x2,
  Grid3x3,
  LayoutList,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ProductItem from "@/components/product/product-item";
import ListingSidebar from "@/components/shop/listing-sidebar";
import SideDrawer from "@/components/ui/side-drawer";
import {
  collectCategoryIds,
  findCategoryBySlug,
} from "@/lib/utils/category-utils";
import {
  filterProducts,
  getProductPriceBounds,
  getUniqueBrands,
  paginateProducts,
  SORT_LABELS,
  sortProducts,
} from "@/lib/utils/product-filters";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/api";

const PER_PAGE = 12;

type ProductListingProps = {
  products: Product[];
  categories: Category[];
  mode?: "default" | "deals";
};

export default function ProductListing({
  products,
  categories,
  mode = "default",
}: ProductListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const categorySlug = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || (mode === "deals" ? "popular" : "latest");
  const page = Number(searchParams.get("page") || "1");

  const [gridCols, setGridCols] = useState<1 | 2 | 4>(4);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const priceBounds = useMemo(() => getProductPriceBounds(products), [products]);
  const activeCategory = useMemo(
    () => findCategoryBySlug(categories, categorySlug),
    [categories, categorySlug],
  );

  useEffect(() => {
    if (!categorySlug || categories.length === 0) {
      setSelectedCategoryIds([]);
      return;
    }

    const matched = findCategoryBySlug(categories, categorySlug);
    if (matched) {
      setSelectedCategoryIds(collectCategoryIds(matched));
    }
  }, [categorySlug, categories]);

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange(getProductPriceBounds(products));
    }
  }, [products]);

  const brands = useMemo(() => getUniqueBrands(products), [products]);

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        search: query,
        categoryIds: selectedCategoryIds,
        brands: selectedBrands,
        priceRange,
        dealsOnly: mode === "deals",
      }),
    [products, query, selectedCategoryIds, selectedBrands, priceRange, mode],
  );

  const sorted = useMemo(() => sortProducts(filtered, sortBy), [filtered, sortBy]);
  const pagination = useMemo(
    () => paginateProducts(sorted, page, PER_PAGE),
    [sorted, page],
  );

  const updateParams = (updates: Record<string, string | number | null>) => {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    router.push(`${pathname}?${next.toString()}`);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    if (activeCategory) {
      setSelectedCategoryIds(collectCategoryIds(activeCategory));
    } else {
      setSelectedCategoryIds([]);
    }
    setPriceRange(priceBounds);
    updateParams({ page: 1 });
  };

  const pageTitle = query
    ? `Tìm kiếm: "${query}"`
    : mode === "deals"
      ? "Ưu đãi đặc biệt"
      : activeCategory
        ? activeCategory.name
        : "Tất cả sản phẩm";

  const pageSubtitle =
    mode === "deals"
      ? "Ưu đãi tốt cho key phần mềm và sản phẩm số"
      : query
        ? `${pagination.totalItems} key & bản quyền phù hợp`
        : activeCategory?.description ||
          "Duyệt key phần mềm chính hãng với giao hàng số tức thì";

  const sidebarProps = {
    categories,
    brands,
    selectedCategoryIds,
    selectedBrands,
    priceRange,
    priceBounds,
    onCategoryChange: setSelectedCategoryIds,
    onBrandChange: setSelectedBrands,
    onPriceChange: setPriceRange,
  };

  const gridClass =
    gridCols === 1
      ? "grid-cols-1"
      : gridCols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

  return (
    <section className="pb-16">
      <div className="container py-6 md:py-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-sm text-keyshop-muted"
        >
          <Link href="/" className="hover:text-white">
            Trang chủ
          </Link>
          <span aria-hidden>›</span>
          <Link href="/products" className="hover:text-white">
            Sản phẩm
          </Link>
          {activeCategory ? (
            <>
              <span aria-hidden>›</span>
              <span className="text-white">{activeCategory.name}</span>
            </>
          ) : null}
          {query && !activeCategory ? (
            <>
              <span aria-hidden>›</span>
              <span className="text-white">Tìm kiếm</span>
            </>
          ) : null}
        </nav>

        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">{pageTitle}</h1>
            <p className="mt-2 max-w-2xl text-keyshop-muted">{pageSubtitle}</p>
          </div>
          <div className="text-sm text-keyshop-muted">
            <strong className="text-white">{pagination.totalItems}</strong> sản phẩm
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <ListingSidebar {...sidebarProps} />
          </div>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-keyshop-line bg-white/[0.03] p-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-control border border-keyshop-line px-3 py-2 text-sm text-white lg:hidden"
                onClick={() => setFilterOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Bộ lọc
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-control border border-keyshop-line px-3 py-2 text-sm text-white"
                >
                  Sắp xếp: {SORT_LABELS[sortBy] || SORT_LABELS.latest}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {sortOpen ? (
                  <div className="absolute left-0 top-full z-20 mt-2 min-w-[220px] rounded-card border border-keyshop-line bg-keyshop-soft p-2 shadow-card">
                    {Object.entries(SORT_LABELS).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={cn(
                          "block w-full rounded-control px-3 py-2 text-left text-sm hover:bg-white/5",
                          sortBy === value && "bg-keyshop-blue/20 text-white",
                        )}
                        onClick={() => {
                          updateParams({ sort: value, page: 1 });
                          setSortOpen(false);
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                {[
                  { cols: 4 as const, icon: Grid3x3 },
                  { cols: 2 as const, icon: Grid2x2 },
                  { cols: 1 as const, icon: LayoutList },
                ].map(({ cols, icon: Icon }) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => setGridCols(cols)}
                    className={cn(
                      "rounded-control border p-2",
                      gridCols === cols
                        ? "border-keyshop-blue bg-keyshop-blue/20 text-white"
                        : "border-keyshop-line text-keyshop-muted hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {pagination.items.length > 0 ? (
              <div className={cn("grid items-stretch gap-5", gridClass)}>
                {pagination.items.map((product, index) => (
                  <ProductItem key={product.id} item={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-dashed border-keyshop-line py-16 text-center text-keyshop-muted">
                Không có sản phẩm phù hợp với bộ lọc.
              </div>
            )}

            {pagination.totalPages > 1 ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: pagination.totalPages }).map((_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => {
                        updateParams({ page: pageNumber });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={cn(
                        "min-w-10 rounded-control border px-3 py-2 text-sm",
                        pagination.page === pageNumber
                          ? "border-keyshop-blue bg-keyshop-blue text-white"
                          : "border-keyshop-line text-keyshop-muted hover:text-white",
                      )}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <SideDrawer open={filterOpen} onClose={() => setFilterOpen(false)} anchor="left">
        <div className="flex items-center justify-between border-b border-keyshop-line p-4 text-white">
          <h3 className="font-semibold">Bộ lọc</h3>
          <button type="button" onClick={() => setFilterOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <ListingSidebar {...sidebarProps} />
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 w-full rounded-control border border-keyshop-line py-2 text-sm text-white hover:bg-white/5"
          >
            Xóa bộ lọc
          </button>
        </div>
      </SideDrawer>
    </section>
  );
}
