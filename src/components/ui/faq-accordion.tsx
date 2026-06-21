import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <h2 className="text-[22px] font-extrabold text-white">Câu hỏi thường gặp</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-control border border-keyshop-line bg-white/[0.03] open:border-keyshop-blue/30"
          >
            <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3">
                {item.question}
                <span
                  className="shrink-0 text-keyshop-muted transition group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-keyshop-line px-5 py-4 text-sm leading-relaxed text-keyshop-muted">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
