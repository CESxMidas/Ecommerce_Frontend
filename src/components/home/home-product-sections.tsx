"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

import AdsCarousel from "@/components/home/ads-carousel";
import ProductCarousel from "@/components/home/product-carousel";
import { cn } from "@/lib/utils";
import type { Banner, Product } from "@/types/api";

const TAB_LABELS = [
  "Games",
  "Software",
  "Antivirus",
  "Windows",
  "Office",
  "Development",
  "Cloud",
  "Mobile Apps",
  "Design",
  "AI Tools",
];

type HomeProductSectionsProps = {
  products: Product[];
  banners: Banner[];
};

export default function HomeProductSections({
  products,
  banners,
}: HomeProductSectionsProps) {
  return (
    <>
      <ProductSectionBlock
        title="Popular Products"
        subtitle="Do not miss the current offers until the end of March"
        showTabs
        ads={3}
        products={products}
        banners={banners}
      />
      <InstantDeliveryBanner />
      <ProductSectionBlock
        title="Latest Products"
        subtitle="Newest software and digital products"
        ads={2}
        products={products}
        banners={banners}
      />
      <ProductSectionBlock
        title="Featured Products"
        subtitle="Top featured premium collections"
        products={products}
        banners={banners}
      />
    </>
  );
}

function ProductSectionBlock({
  title,
  subtitle,
  showTabs = false,
  ads = 0,
  products,
  banners,
}: {
  title: string;
  subtitle?: string;
  showTabs?: boolean;
  ads?: number;
  products: Product[];
  banners: Banner[];
}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="mt-16 lg:mt-20">
      <div className="container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
            {subtitle ? <p className="mt-2 text-keyshop-muted">{subtitle}</p> : null}
          </div>

          {showTabs ? (
            <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto rounded-card border border-keyshop-line bg-white/[0.04] p-2">
              {TAB_LABELS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "whitespace-nowrap rounded-control px-4 py-2.5 text-sm font-bold text-white/70 transition-colors",
                    activeTab === index
                      ? "bg-keyshop-blue text-white shadow-glow"
                      : "hover:bg-white/5",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <ProductCarousel products={products} />
        {ads > 0 ? <AdsCarousel banners={banners} items={ads} /> : null}
      </div>
    </section>
  );
}

function InstantDeliveryBanner() {
  return (
    <section className="mt-16 lg:mt-20">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 rounded-card border border-keyshop-line bg-white/[0.03] p-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-keyshop-blue/20 text-keyshop-blue">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">INSTANT DELIVERY</h3>
          </div>
          <p className="max-w-2xl text-keyshop-muted">
            License keys are delivered digitally after payment confirmation.
          </p>
          <p className="text-xl font-bold text-keyshop-blue">24/7 access</p>
        </div>
      </div>
    </section>
  );
}
