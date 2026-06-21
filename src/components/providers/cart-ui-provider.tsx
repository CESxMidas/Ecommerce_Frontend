"use client";

import { createContext, useContext, useMemo, useState } from "react";

type CartUiContextValue = {
  openCartPanel: boolean;
  setOpenCartPanel: (open: boolean) => void;
};

const CartUiContext = createContext<CartUiContextValue | null>(null);

export function CartUiProvider({ children }: { children: React.ReactNode }) {
  const [openCartPanel, setOpenCartPanel] = useState(false);

  const value = useMemo(
    () => ({ openCartPanel, setOpenCartPanel }),
    [openCartPanel],
  );

  return <CartUiContext.Provider value={value}>{children}</CartUiContext.Provider>;
}

export function useCartUi() {
  const context = useContext(CartUiContext);
  if (!context) {
    throw new Error("useCartUi must be used within CartUiProvider");
  }
  return context;
}
