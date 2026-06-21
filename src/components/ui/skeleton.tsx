import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-control bg-white/[0.06] motion-reduce:animate-none",
        className,
      )}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-keyshop-line bg-product-card">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function ProductListingSkeleton() {
  return (
    <section className="pb-16" role="status" aria-label="Đang tải sản phẩm">
      <div className="container py-6 md:py-8">
        <Skeleton className="mb-4 h-4 w-48" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden space-y-4 lg:block">
            <Skeleton className="h-72 w-full rounded-card" />
          </div>
          <div>
            <Skeleton className="mb-6 h-14 w-full rounded-card" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AccountPageSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Đang tải">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-24 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
      </div>
    </div>
  );
}
