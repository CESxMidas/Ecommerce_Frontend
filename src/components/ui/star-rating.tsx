import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
};

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  size = "sm",
  showValue,
  reviewCount,
  className,
}: StarRatingProps) {
  const rounded = Math.round(rating);
  const label =
    reviewCount != null
      ? `${rating.toFixed(1)} trên 5 sao, ${reviewCount} đánh giá`
      : `${rating.toFixed(1)} trên 5 sao`;

  return (
    <div
      className={cn("flex items-center gap-0.5 text-keyshop-muted", className)}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            sizeMap[size],
            index < rounded ? "fill-yellow-400 text-yellow-400" : "text-white/20",
          )}
          aria-hidden
        />
      ))}
      {showValue ? (
        <span className="ml-1 text-sm text-keyshop-muted">{rating.toFixed(1)}</span>
      ) : null}
      {reviewCount != null && reviewCount > 0 ? (
        <span className="ml-1 text-[11px] text-keyshop-muted">({reviewCount})</span>
      ) : null}
    </div>
  );
}
