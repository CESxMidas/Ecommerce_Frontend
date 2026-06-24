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
      <h2 className="text-lg font-extrabold text-white sm:text-xl md:text-[22px]">Câu hỏi thường gặp</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-control border border-keyshop-line bg-white/[0.03] open:border-keyshop-blue/30"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center px-4 py-3 text-sm font-semibold text-white marker:content-none sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
              <span className="flex w-full items-center justify-between gap-3">
                <span className="break-words pr-2">{item.question}</span>
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
