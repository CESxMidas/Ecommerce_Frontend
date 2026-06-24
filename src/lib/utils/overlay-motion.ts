import { cn } from "@/lib/utils";

const fadeTransition =
  "transition-opacity duration-300 ease-out motion-reduce:transition-none";

const motionTransition =
  "transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100";

export function overlayBackdropClass(active: boolean) {
  return cn(
    "fixed inset-0 z-[1200] min-h-screen bg-keyshop-bg/70 backdrop-blur-[2px]",
    fadeTransition,
    active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
  );
}

export function overlayModalBackdropClass(active: boolean) {
  return cn(
    "fixed inset-0 z-[1300] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-4",
    fadeTransition,
    active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
  );
}

export function overlayDrawerPanelClass(
  active: boolean,
  anchor: "left" | "right",
  className?: string,
) {
  return cn(
    "keyshop-scrollbar fixed inset-y-0 z-[1201] max-h-screen max-w-full overflow-y-auto bg-keyshop-soft",
    motionTransition,
    anchor === "left"
      ? cn(
          "left-0 w-[min(320px,100vw)]",
          active ? "translate-x-0" : "-translate-x-full",
        )
      : cn(
          "right-0 w-[min(580px,100vw)] bg-keyshop-bg",
          active ? "translate-x-0" : "translate-x-full",
        ),
    className,
  );
}

export function overlayModalPanelClass(active: boolean, className?: string) {
  return cn(
    "keyshop-scrollbar max-h-[92vh] w-full overflow-y-auto rounded-card border border-keyshop-line bg-keyshop-bg shadow-glow",
    motionTransition,
    active
      ? "translate-y-0 scale-100 opacity-100"
      : "translate-y-4 scale-[0.97] opacity-0",
    className,
  );
}

export function overlayDialogPanelClass(active: boolean, className?: string) {
  return cn(
    "keyshop-scrollbar max-h-[92vh] w-full overflow-y-auto rounded-card border border-keyshop-line bg-keyshop-bg shadow-glow",
    motionTransition,
    active
      ? "translate-y-0 scale-100 opacity-100"
      : "translate-y-4 scale-[0.97] opacity-0",
    className,
  );
}
