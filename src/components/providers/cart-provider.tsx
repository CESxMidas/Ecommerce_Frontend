"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import * as cartService from "@/lib/services/cart-service";
import * as wishlistService from "@/lib/services/wishlist-service";
import {
  calcCartSummary,
  clearStoredCart,
  consumeCheckoutCompleted,
  loadCart,
  markCheckoutCompleted,
  saveCart,
} from "@/lib/utils/cart-storage";
import {
  getCartItemKey,
  getDefaultPurchaseVariant,
  normalizeProduct,
  resolvePurchaseVariant,
} from "@/lib/utils/product-schema";
import {
  loadCompare,
  MAX_COMPARE_ITEMS,
  saveCompare,
} from "@/lib/utils/compare-storage";
import {
  clearStoredWishlist,
  loadWishlist,
  saveWishlist,
} from "@/lib/utils/wishlist-storage";
import { getAccessToken } from "@/lib/api/client";
import type {
  CartItem,
  CartSummary,
  NormalizedProduct,
  PlacedOrder,
  PurchaseVariant,
} from "@/types/cart";

type CartContextValue = {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  licenseKeyOrder: PlacedOrder | null;
  isAuthenticated: boolean;
  openCartPanel: boolean;
  setOpenCartPanel: (open: boolean) => void;
  wishlist: NormalizedProduct[];
  compareItems: NormalizedProduct[];
  toggleWishlist: (product: NormalizedProduct | Record<string, unknown>) => void;
  isInWishlist: (productId: string) => boolean;
  toggleCompare: (product: NormalizedProduct | Record<string, unknown>) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  addToCart: (
    product: NormalizedProduct | Record<string, unknown>,
    quantity?: number,
    selectedVariant?: PurchaseVariant | null,
  ) => Promise<boolean>;
  removeFromCart: (
    productId: string,
    variant?: PurchaseVariant | null,
  ) => Promise<void>;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    variant?: PurchaseVariant | null,
  ) => Promise<void>;
  updateCartVariant: (
    cartItem: CartItem,
    nextVariant: PurchaseVariant,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  completeCheckout: () => Promise<void>;
  closeLicenseKeyModal: () => void;
  showLicenseKeysFromOrder: (order: PlacedOrder) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function mergeCartItems(baseItems: CartItem[] = [], incomingItems: CartItem[] = []) {
  const merged = new Map<string, CartItem>();

  [...baseItems, ...incomingItems].forEach((item) => {
    const key = getCartItemKey(item);
    const existing = merged.get(key);

    if (existing) {
      merged.set(key, {
        ...existing,
        quantity: Number(existing.quantity || 0) + Number(item.quantity || 0),
        product: existing.product || item.product,
        variant: existing.variant || item.variant || null,
      });
      return;
    }

    merged.set(key, {
      ...item,
      quantity: Number(item.quantity) || 1,
      variant: item.variant || null,
    });
  });

  return Array.from(merged.values());
}

function getSessionUser(session: ReturnType<typeof useSession>["data"]) {
  if (!session?.user) return null;

  return {
    _id: session.user.id,
    id: session.user.id,
    email: session.user.email || undefined,
    name: session.user.name || undefined,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const sessionUser = getSessionUser(session);
  const sessionUserId = sessionUser?._id ?? sessionUser?.email ?? null;
  const isAuthenticated = status === "authenticated";

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [licenseKeyOrder, setLicenseKeyOrder] = useState<PlacedOrder | null>(null);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [wishlist, setWishlist] = useState<NormalizedProduct[]>([]);
  const [compareItems, setCompareItems] = useState<NormalizedProduct[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCartItems(loadCart(sessionUser));
    setWishlist(loadWishlist(sessionUser));
    setCompareItems(loadCompare());
    setHydrated(true);
  }, [sessionUserId, sessionUser?.email]);

  useEffect(() => {
    if (!hydrated) return;
    saveWishlist(wishlist, sessionUser);
  }, [wishlist, sessionUser, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveCompare(compareItems);
  }, [compareItems, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    saveCart(cartItems, sessionUser);
  }, [cartItems, sessionUser, hydrated]);

  useEffect(() => {
    if (status !== "authenticated" || !getAccessToken()) return;

    const syncServerCart = async () => {
      try {
        const localCart = loadCart();
        const serverCart = await cartService.fetchCart();

        if (localCart.length > 0) {
          const mergedCart = mergeCartItems(serverCart, localCart);
          const syncedCart = await cartService.replaceCart(mergedCart);
          clearStoredCart();
          setCartItems(syncedCart);
        } else {
          setCartItems(serverCart);
        }
      } catch {
        setCartItems(loadCart(sessionUser));
      }
    };

    syncServerCart();
  }, [status, sessionUserId]);

  useEffect(() => {
    if (status !== "authenticated" || !getAccessToken()) return;

    const syncServerWishlist = async () => {
      try {
        const localWishlist = loadWishlist();
        const serverWishlist = await wishlistService.fetchWishlist();

        if (localWishlist.length > 0) {
          const mergedIds = Array.from(
            new Set([
              ...serverWishlist.map((item) => String(item.id)),
              ...localWishlist.map((item: { id?: string | number }) =>
                String(item.id),
              ),
            ]),
          );
          const syncedWishlist = await wishlistService.replaceWishlist(mergedIds);
          clearStoredWishlist();
          setWishlist(syncedWishlist);
        } else {
          setWishlist(serverWishlist);
        }
      } catch {
        setWishlist(loadWishlist(sessionUser));
      }
    };

    syncServerWishlist();
  }, [status, sessionUserId]);

  useEffect(() => {
    const clearCompletedCheckoutCart = () => {
      if (!consumeCheckoutCompleted()) {
        return;
      }

      localStorage.removeItem("appliedCoupon");
      clearStoredCart(sessionUser);
      setCartItems([]);

      if (getAccessToken()) {
        cartService.replaceCart([]).catch(() => {});
      }
    };

    clearCompletedCheckoutCart();

    window.addEventListener("pageshow", clearCompletedCheckoutCart);
    window.addEventListener("focus", clearCompletedCheckoutCart);
    document.addEventListener("visibilitychange", clearCompletedCheckoutCart);

    return () => {
      window.removeEventListener("pageshow", clearCompletedCheckoutCart);
      window.removeEventListener("focus", clearCompletedCheckoutCart);
      document.removeEventListener("visibilitychange", clearCompletedCheckoutCart);
    };
  }, [sessionUser]);

  const addToCart = useCallback(
    async (
      product: NormalizedProduct | Record<string, unknown>,
      quantity = 1,
      selectedVariant: PurchaseVariant | null | undefined = undefined,
    ) => {
      const normalizedProduct = normalizeProduct(product as Record<string, unknown>);

      if (!normalizedProduct) return false;

      const variant =
        selectedVariant === undefined
          ? getDefaultPurchaseVariant(normalizedProduct)
          : resolvePurchaseVariant(normalizedProduct, selectedVariant);

      if (getAccessToken()) {
        try {
          const items = await cartService.addToCart(
            normalizedProduct.id,
            quantity,
            variant,
          );
          setCartItems(items);
          toast.success("Added to cart");
          return true;
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to add to cart",
          );
          return false;
        }
      }

      setCartItems((prev) => {
        const existing = prev.find(
          (item) =>
            getCartItemKey(item) ===
            getCartItemKey({ productId: normalizedProduct.id, variant }),
        );

        if (existing) {
          return prev.map((item) =>
            getCartItemKey(item) ===
            getCartItemKey({ productId: normalizedProduct.id, variant })
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  variant,
                }
              : item,
          );
        }

        return [
          ...prev,
          {
            productId: normalizedProduct.id,
            quantity,
            variant,
            product: normalizedProduct,
          },
        ];
      });

      toast.success("Added to cart");
      return true;
    },
    [],
  );

  const toggleWishlist = useCallback(
    async (product: NormalizedProduct | Record<string, unknown>) => {
      const normalizedProduct = normalizeProduct(product as Record<string, unknown>);
      if (!normalizedProduct) return;

      const productId = String(normalizedProduct.id);
      const exists = wishlist.some((item) => String(item.id) === productId);

      if (getAccessToken()) {
        try {
          const items = exists
            ? await wishlistService.removeFromWishlist(productId)
            : await wishlistService.addToWishlist(productId);
          setWishlist(items);
          toast.success(
            exists ? "Removed from wishlist" : "Added to wishlist",
          );
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to update wishlist",
          );
        }
        return;
      }

      setWishlist((prev) => {
        const inList = prev.some((item) => String(item.id) === productId);

        if (inList) {
          toast.success("Removed from wishlist");
          return prev.filter((item) => String(item.id) !== productId);
        }

        toast.success("Added to wishlist");
        return [...prev, normalizedProduct];
      });
    },
    [wishlist],
  );

  const isInWishlist = useCallback(
    (productId: string) =>
      wishlist.some((item) => String(item.id) === String(productId)),
    [wishlist],
  );

  const toggleCompare = useCallback(
    (product: NormalizedProduct | Record<string, unknown>) => {
      const normalizedProduct = normalizeProduct(product as Record<string, unknown>);
      if (!normalizedProduct) return;

      setCompareItems((prev) => {
        const exists = prev.some(
          (item) => String(item.id) === String(normalizedProduct.id),
        );

        if (exists) {
          toast.success("Removed from compare");
          return prev.filter(
            (item) => String(item.id) !== String(normalizedProduct.id),
          );
        }

        if (prev.length >= MAX_COMPARE_ITEMS) {
          toast.error(`Compare up to ${MAX_COMPARE_ITEMS} products`);
          return prev;
        }

        toast.success("Added to compare");
        return [...prev, normalizedProduct];
      });
    },
    [],
  );

  const isInCompare = useCallback(
    (productId: string) =>
      compareItems.some((item) => String(item.id) === String(productId)),
    [compareItems],
  );

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems((prev) =>
      prev.filter((item) => String(item.id) !== String(productId)),
    );
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
    toast.success("Compare list cleared");
  }, []);

  const removeFromCart = useCallback(
    async (productId: string, variant: PurchaseVariant | null = null) => {
      if (getAccessToken()) {
        try {
          const items = await cartService.removeFromCart(productId, variant);
          setCartItems(items);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to update cart",
          );
        }
        return;
      }

      setCartItems((prev) =>
        prev.filter(
          (item) =>
            getCartItemKey(item) !== getCartItemKey({ productId, variant }),
        ),
      );
    },
    [],
  );

  const updateCartQuantity = useCallback(
    async (
      productId: string,
      quantity: number,
      variant: PurchaseVariant | null = null,
    ) => {
      if (quantity < 1) {
        await removeFromCart(productId, variant);
        return;
      }

      if (getAccessToken()) {
        try {
          const items = await cartService.updateCartItem(
            productId,
            quantity,
            variant,
          );
          setCartItems(items);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to update cart",
          );
        }
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          getCartItemKey(item) === getCartItemKey({ productId, variant })
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [removeFromCart],
  );

  const updateCartVariant = useCallback(
    async (cartItem: CartItem, nextVariant: PurchaseVariant) => {
      if (!cartItem?.product || !nextVariant) return;

      const product = normalizeProduct(
        cartItem.product as unknown as Record<string, unknown>,
      );

      if (!product) return;

      const variant = resolvePurchaseVariant(product, nextVariant);

      if (!variant || variant.id === cartItem.variant?.id) {
        return;
      }

      await removeFromCart(cartItem.productId, cartItem.variant);
      await addToCart(product, cartItem.quantity, variant);
    },
    [addToCart, removeFromCart],
  );

  const clearCart = useCallback(async () => {
    if (getAccessToken()) {
      try {
        await cartService.replaceCart([]);
      } catch {
        // ignore
      }
    }

    setCartItems([]);
  }, []);

  const completeCheckout = useCallback(async () => {
    markCheckoutCompleted();
    localStorage.removeItem("appliedCoupon");
    clearStoredCart(sessionUser);
    await clearCart();
  }, [clearCart, sessionUser]);

  const showLicenseKeysFromOrder = useCallback((order: PlacedOrder) => {
    const keys =
      order?.items?.flatMap((item) =>
        (item.licenseKeys || []).map((key) => ({
          key,
          productName: item.product?.name || item.product?.title || "Product",
        })),
      ) || [];

    if (keys.length > 0) {
      setLicenseKeyOrder(order);
    }
  }, []);

  const closeLicenseKeyModal = useCallback(() => {
    setLicenseKeyOrder(null);
  }, []);

  const cartSummary = useMemo(() => calcCartSummary(cartItems), [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      cartSummary,
      licenseKeyOrder,
      isAuthenticated,
      openCartPanel,
      setOpenCartPanel,
      wishlist,
      compareItems,
      toggleWishlist,
      isInWishlist,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      updateCartVariant,
      clearCart,
      completeCheckout,
      closeLicenseKeyModal,
      showLicenseKeysFromOrder,
    }),
    [
      cartItems,
      cartSummary,
      licenseKeyOrder,
      isAuthenticated,
      openCartPanel,
      wishlist,
      compareItems,
      toggleWishlist,
      isInWishlist,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      updateCartVariant,
      clearCart,
      completeCheckout,
      closeLicenseKeyModal,
      showLicenseKeysFromOrder,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
