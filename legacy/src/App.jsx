import { createContext, useCallback, useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./Pages/Home";
import ProductListing from "./Pages/ProductListing";
import ProductDetail from "./components/ProductDetail";
import ProductDetailModal from "./components/ProductDetailModal";

import Login from "./Pages/Login";
import Register from "./Pages/Register";

import Dialog from "@mui/material/Dialog";

import CartPanel from "./components/CartPanel";
import Cart from "./Pages/Cart";
import LicenseKeyModal, {
  collectLicenseKeysFromOrder,
} from "./components/LicenseKeyModal";
import Verify from "./components/Verify";

import toast, { Toaster } from "react-hot-toast";

import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

import CheckOut from "./Pages/CheckOut";
import MyAccount from "./Pages/MyAccount";
import MyAddress from "./Pages/MyAddress";
import MyOrders from "./Pages/Orders";
import MyListItem from "./Pages/MyListItem";
import AccountLicenses from "./Pages/AccountLicenses";
import AccountNotifications from "./Pages/AccountNotifications";
import AccountSecurity from "./Pages/AccountSecurity";
import AccountTickets from "./Pages/AccountTickets";
import BlogDetail from "./Pages/BlogDetail";
import BlogList from "./Pages/BlogList";
import Compare from "./Pages/Compare";
import NotFound from "./Pages/NotFound";
import OrderDetail from "./Pages/OrderDetail";
import StaticPage from "./Pages/StaticPage";
import TrackOrder from "./Pages/TrackOrder";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/commerce-pages.css";
import {
  calcCartSummary,
  clearStoredCart,
  consumeCheckoutCompleted,
  loadCart,
  markCheckoutCompleted,
  saveCart,
} from "./utils/cartStorage";
import {
  getCartItemKey,
  getDefaultPurchaseVariant,
  isLicenseKeyProduct,
  normalizeProduct,
  resolvePurchaseVariant,
} from "./utils/productSchema";
import {
  getUserWishlistKey,
  loadWishlist,
  saveWishlist,
} from "./utils/wishlistStorage";
import {
  loadCompare,
  MAX_COMPARE_ITEMS,
  saveCompare,
} from "./utils/compareStorage";
import { getMe } from "./services/authService";
import * as cartService from "./services/cartService";
import * as wishlistService from "./services/wishlistService";
import apiClient, {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./services/apiClient";
import { API_ENDPOINTS } from "./constants/apiEndpoints";

const MyContext = createContext();

function mergeCartItems(baseItems = [], incomingItems = []) {
  const merged = new Map();

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

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // ================= UI STATE =================

  const [openCartPanel, setOpenCartPanel] = useState(false);

  const [openProductDetailModal, setOpenProductDetailModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  // ================= AUTH STATE =================

  const [auth, setAuth] = useState(() => {
    try {
      const userData = localStorage.getItem("user");

      if (userData) {
        return {
          isLogin: true,
          user: JSON.parse(userData),
        };
      }
    } catch {
      localStorage.removeItem("user");
    }

    return {
      isLogin: false,
      user: null,
    };
  });

  const [cartItems, setCartItems] = useState(() => loadCart(auth.user));

  const [wishlist, setWishlist] = useState(() => loadWishlist(auth.user));

  const [compareItems, setCompareItems] = useState(loadCompare);

  const [licenseKeyOrder, setLicenseKeyOrder] = useState(null);

  useEffect(() => {
    saveCart(cartItems, auth.user);
  }, [cartItems, auth.user]);

  useEffect(() => {
    saveWishlist(wishlist, auth.user);
  }, [wishlist, auth.user]);

  useEffect(() => {
    saveCompare(compareItems);
  }, [compareItems]);

  const getStoredToken = () => {
    return getAccessToken();
  };

  const getStoredUser = useCallback(() => {
    try {
      const stored = localStorage.getItem("user");

      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const loadWishlistFromServer = useCallback(async (fallbackUser = null) => {
    const requestedUser = fallbackUser || getStoredUser();
    const requestedKey = getUserWishlistKey(requestedUser);

    try {
      const serverItems = await wishlistService.fetchWishlist();
      const currentKey = getUserWishlistKey(getStoredUser());

      if (currentKey === requestedKey) {
        setWishlist(serverItems);
      }
    } catch {
      const currentKey = getUserWishlistKey(getStoredUser());

      if (currentKey === requestedKey) {
        setWishlist(loadWishlist(requestedUser));
      }
    }
  }, [getStoredUser]);

  useEffect(() => {
    const restoreSession = async () => {
      const stored = localStorage.getItem("user");

      if (!stored) return;

      try {
        const parsed = JSON.parse(stored);

        const profile = await getMe();
        const user = { ...parsed, ...profile };

        localStorage.setItem("user", JSON.stringify(user));

        setWishlist(loadWishlist(user));

        setAuth({
          isLogin: true,
          user,
        });

        const serverCart = await cartService.fetchCart();
        setCartItems(serverCart);

        await loadWishlistFromServer(user);
      } catch {
        localStorage.removeItem("user");
        clearAccessToken();

        setAuth({
          isLogin: false,
          user: null,
        });

        setCartItems(loadCart());
        setWishlist(loadWishlist());
      }
    };

    restoreSession();
  }, [loadWishlistFromServer]);

  // ================= PRODUCT MODAL =================

  const handleOpenProductDetailModal = (product) => {
    if (product) {
      setSelectedProduct(product);
    }

    setOpenProductDetailModal(true);
  };

  const handleCloseProductDetailModal = () => {
    setOpenProductDetailModal(false);
    setSelectedProduct(null);
  };

  // ================= TOAST =================

  const openAlertBox = (type, message) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;

      case "error":
        toast.error(message);
        break;

      case "warning":
        toast(message, {
          icon: "!",
        });
        break;

      default:
        toast(message);
    }
  };

  // ================= LOGIN =================

  const login = async (userData) => {
    const safeUserData = { ...(userData || {}) };
    setAccessToken(safeUserData.token);
    delete safeUserData.token;
    delete safeUserData.refreshToken;

    localStorage.setItem("user", JSON.stringify(safeUserData));

    setWishlist(loadWishlist(safeUserData));

    setAuth({
      isLogin: true,
      user: safeUserData,
    });

    if (getAccessToken()) {
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
        // keep local cart when server cart is unavailable
      }

      try {
        await loadWishlistFromServer(safeUserData);
      } catch {
        setWishlist(loadWishlist(userData));
      }
    }

    openAlertBox("success", "Login Success");
  };

  const updateUser = (profile) => {
    const updatedUser = {
      ...auth.user,
      ...profile,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setAuth({
      isLogin: true,
      user: updatedUser,
    });
  };

  // ================= LOGOUT =================

  const logout = async () => {
    const loggedOutUser = auth.user;

    try {
      await apiClient.post(API_ENDPOINTS.auth.logout, {});
    } catch {
      // ignore logout API errors
    }

    clearStoredCart(loggedOutUser);
    clearStoredCart();
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("user");
    clearAccessToken();

    setAuth({
      isLogin: false,
      user: null,
    });

    setCartItems([]);
    setWishlist([]);

    openAlertBox("success", "Logout Success");
  };

  // ================= CART =================

  const addToCart = async (product, quantity = 1, selectedVariant = undefined) => {
    if (!product) return;

    const normalizedProduct = normalizeProduct(product);
    const variant =
      selectedVariant === undefined
        ? getDefaultPurchaseVariant(normalizedProduct)
        : resolvePurchaseVariant(normalizedProduct, selectedVariant);

    if (getStoredToken()) {
      try {
        const items = await cartService.addToCart(
          normalizedProduct.id,
          quantity,
          variant,
        );
        setCartItems(items);
        openAlertBox("success", "Added to cart");
        return true;
      } catch (error) {
        openAlertBox("error", error.message || "Failed to add to cart");
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
            : item
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

    openAlertBox("success", "Added to cart");
    return true;
  };

  const removeFromCart = async (productId, variant = null) => {
    if (getStoredToken()) {
      try {
        const items = await cartService.removeFromCart(productId, variant);
        setCartItems(items);
      } catch (error) {
        openAlertBox("error", error.message || "Failed to update cart");
      }

      return;
    }

    setCartItems((prev) =>
      prev.filter(
        (item) =>
          getCartItemKey(item) !== getCartItemKey({ productId, variant }),
      )
    );
  };

  const updateCartQuantity = async (productId, quantity, variant = null) => {
    if (quantity < 1) {
      await removeFromCart(productId, variant);
      return;
    }

    if (getStoredToken()) {
      try {
        const items = await cartService.updateCartItem(
          productId,
          quantity,
          variant,
        );
        setCartItems(items);
      } catch (error) {
        openAlertBox("error", error.message || "Failed to update cart");
      }

      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        getCartItemKey(item) === getCartItemKey({ productId, variant })
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateCartVariant = async (cartItem, nextVariant) => {
    if (!cartItem?.product || !nextVariant) return;

    const product = normalizeProduct(cartItem.product);
    const variant = resolvePurchaseVariant(product, nextVariant);

    if (!variant || variant.id === cartItem.variant?.id) {
      return;
    }

    await removeFromCart(cartItem.productId, cartItem.variant);
    await addToCart(product, cartItem.quantity, variant);
  };

  const clearCart = async () => {
    if (getStoredToken()) {
      try {
        await cartService.replaceCart([]);
      } catch {
        // ignore server cart clear errors
      }
    }

    setCartItems([]);
  };

  const completeCheckout = async () => {
    markCheckoutCompleted();
    localStorage.removeItem("appliedCoupon");
    clearStoredCart(auth.user);
    await clearCart();
  };

  useEffect(() => {
    const clearCompletedCheckoutCart = () => {
      if (!consumeCheckoutCompleted()) {
        return;
      }

      localStorage.removeItem("appliedCoupon");
      clearStoredCart(getStoredUser());
      setCartItems([]);

      if (getStoredToken()) {
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
  }, [getStoredUser]);

  const cartSummary = calcCartSummary(cartItems);

  const showLicenseKeysFromOrder = (order) => {
    const keys = collectLicenseKeysFromOrder(order);

    if (keys.length > 0) {
      setLicenseKeyOrder(order);
    }
  };

  const closeLicenseKeyModal = () => {
    setLicenseKeyOrder(null);
  };

  const purchaseLicenseProduct = async (product, quantity = 1, variant = undefined) => {
    const normalized = normalizeProduct(product);

    if (!auth.isLogin || !auth.user?.email) {
      openAlertBox("error", "Please login to purchase this digital code");
      navigate("/login");
      return;
    }

    const added = await addToCart(normalized, quantity, variant);

    if (!added) return;

    openAlertBox("success", "Checkout with VNPay to receive your code");
    navigate("/checkout");
  };

  // ================= COMPARE =================

  const toggleCompare = (product) => {
    if (!product) return;

    const normalizedProduct = normalizeProduct(product);

    setCompareItems((prev) => {
      const exists = prev.some((item) => item.id === normalizedProduct.id);

      if (exists) {
        openAlertBox("success", "Removed from compare");
        return prev.filter((item) => item.id !== normalizedProduct.id);
      }

      if (prev.length >= MAX_COMPARE_ITEMS) {
        openAlertBox("warning", `Compare up to ${MAX_COMPARE_ITEMS} products`);
        return prev;
      }

      openAlertBox("success", "Added to compare");
      return [...prev, normalizedProduct];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) =>
      prev.filter((item) => String(item.id) !== String(productId))
    );
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) =>
    compareItems.some((item) => String(item.id) === String(productId));

  // ================= WISHLIST =================

  const toggleWishlist = async (product) => {
    if (!product) return;

    const normalizedProduct = normalizeProduct(product);

    if (getStoredToken()) {
      try {
        const exists = wishlist.some(
          (item) => item.id === normalizedProduct.id,
        );

        const items = exists
          ? await wishlistService.removeFromWishlist(normalizedProduct.id)
          : await wishlistService.addToWishlist(normalizedProduct.id);

        setWishlist(items);
        openAlertBox(
          "success",
          exists ? "Removed from wishlist" : "Added to wishlist",
        );
      } catch (error) {
        openAlertBox(
          "error",
          error.message || "Failed to update wishlist",
        );
      }

      return;
    }

    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === normalizedProduct.id);

      if (exists) {
        openAlertBox("success", "Removed from wishlist");
        return prev.filter((item) => item.id !== normalizedProduct.id);
      }

      openAlertBox("success", "Added to wishlist");
      return [...prev, normalizedProduct];
    });
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  // ================= CONTEXT =================

  const values = {
    handleOpenProductDetailModal,
    handleCloseProductDetailModal,

    openCartPanel,
    setOpenCartPanel,

    openAlertBox,

    selectedProduct,

    cartItems,
    cartSummary,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartVariant,
    clearCart,
    completeCheckout,

    wishlist,
    toggleWishlist,
    isInWishlist,

    compareItems,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,

    isLogin: auth.isLogin,
    user: auth.user,

    login,
    logout,
    updateUser,

    showLicenseKeysFromOrder,
    purchaseLicenseProduct,
    isLicenseKeyProduct,
  };

  // ================= HIDE HEADER FOOTER =================

  const authPages =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verifyAccount" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  return (
    <MyContext.Provider value={values}>
      {/* HEADER */}
      {!authPages && <Header />}

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productListing" element={<ProductListing />} />
        <Route path="/deals" element={<ProductListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/about" element={<StaticPage />} />
        <Route path="/contact" element={<StaticPage />} />
        <Route path="/help-center" element={<StaticPage />} />
        <Route path="/terms" element={<StaticPage />} />
        <Route path="/privacy-policy" element={<StaticPage />} />
        <Route path="/returns" element={<StaticPage />} />
        <Route path="/shipping" element={<StaticPage />} />
        <Route path="/payment-policy" element={<StaticPage />} />
        <Route path="/verifyAccount" element={<Verify />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/myAccount"
          element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <MyAddress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-list"
          element={
            <ProtectedRoute>
              <MyListItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/licenses"
          element={
            <ProtectedRoute>
              <AccountLicenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <AccountNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <AccountTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security"
          element={
            <ProtectedRoute>
              <AccountSecurity />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* FOOTER */}
      {!authPages && <Footer />}

      {/* PRODUCT MODAL */}
      <Dialog
        open={openProductDetailModal}
        onClose={handleCloseProductDetailModal}
        maxWidth="lg"
        fullWidth
        className="productModal"
      >
        <ProductDetailModal />
      </Dialog>
      {/* CART PANEL */}
      {!authPages && <CartPanel />}

      <LicenseKeyModal
        open={Boolean(licenseKeyOrder)}
        order={licenseKeyOrder}
        onClose={closeLicenseKeyModal}
      />
    </MyContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

export { MyContext };
