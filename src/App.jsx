import { createContext, useEffect, useState } from "react";

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
import { placeOrder } from "./services/orderService";
import Verify from "./components/Verify";

import toast, { Toaster } from "react-hot-toast";

import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

import CheckOut from "./Pages/CheckOut";
import MyAccount from "./Pages/MyAccount";
import MyOrders from "./Pages/Orders";
import MyListItem from "./Pages/MyListItem";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  calcCartSummary,
  loadCart,
  saveCart,
} from "./utils/cartStorage";
import {
  getSalePrice,
  isLicenseKeyProduct,
  normalizeProduct,
} from "./utils/productSchema";
import {
  loadWishlist,
  saveWishlist,
} from "./utils/wishlistStorage";
import { getMe } from "./services/authService";
import * as cartService from "./services/cartService";

const MyContext = createContext();

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // ================= UI STATE =================

  const [openCartPanel, setOpenCartPanel] = useState(false);

  const [openProductDetailModal, setOpenProductDetailModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cartItems, setCartItems] = useState(loadCart);

  const [wishlist, setWishlist] = useState(loadWishlist);

  const [licenseKeyOrder, setLicenseKeyOrder] = useState(null);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  const getStoredToken = () => {
    try {
      const stored = localStorage.getItem("user");

      return stored ? JSON.parse(stored).token : null;
    } catch {
      return null;
    }
  };

  // ================= AUTH STATE =================

  const [auth, setAuth] = useState(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      return {
        isLogin: true,
        user: JSON.parse(userData),
      };
    }

    return {
      isLogin: false,
      user: null,
    };
  });

  useEffect(() => {
    const restoreSession = async () => {
      const stored = localStorage.getItem("user");

      if (!stored) return;

      try {
        const parsed = JSON.parse(stored);

        if (!parsed?.token) return;

        const profile = await getMe();
        const user = { ...parsed, ...profile, token: parsed.token };

        localStorage.setItem("user", JSON.stringify(user));

        setAuth({
          isLogin: true,
          user,
        });

        const serverCart = await cartService.fetchCart();
        setCartItems(serverCart);
      } catch {
        localStorage.removeItem("user");

        setAuth({
          isLogin: false,
          user: null,
        });
      }
    };

    restoreSession();
  }, []);

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
          icon: "⚠️",
        });
        break;

      default:
        toast(message);
    }
  };

  // ================= LOGIN =================

  const login = async (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));

    setAuth({
      isLogin: true,
      user: userData,
    });

    if (userData?.token) {
      try {
        const localCart = loadCart();

        if (localCart.length > 0) {
          const serverCart = await cartService.replaceCart(localCart);
          setCartItems(serverCart);
        } else {
          const serverCart = await cartService.fetchCart();
          setCartItems(serverCart);
        }
      } catch {
        // keep local cart when server cart is unavailable
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

  const logout = () => {
    localStorage.removeItem("user");

    setAuth({
      isLogin: false,
      user: null,
    });

    openAlertBox("success", "Logout Success");
  };

  // ================= CART =================

  const addToCart = async (product, quantity = 1) => {
    if (!product) return;

    const normalizedProduct = normalizeProduct(product);

    if (getStoredToken()) {
      try {
        const items = await cartService.addToCart(
          normalizedProduct.id,
          quantity,
        );
        setCartItems(items);
        openAlertBox("success", "Added to cart");
      } catch (error) {
        openAlertBox("error", error.message || "Failed to add to cart");
      }

      return;
    }

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === normalizedProduct.id,
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === normalizedProduct.id
            ? {
              ...item,
              quantity: item.quantity + quantity,
            }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: normalizedProduct.id,
          quantity,
          product: normalizedProduct,
        },
      ];
    });

    openAlertBox("success", "Added to cart");
  };

  const removeFromCart = async (productId) => {
    if (getStoredToken()) {
      try {
        const items = await cartService.removeFromCart(productId);
        setCartItems(items);
      } catch (error) {
        openAlertBox("error", error.message || "Failed to update cart");
      }

      return;
    }

    setCartItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    if (getStoredToken()) {
      try {
        const items = await cartService.updateCartItem(
          productId,
          quantity
        );
        setCartItems(items);
      } catch (error) {
        openAlertBox("error", error.message || "Failed to update cart");
      }

      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
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

  const purchaseLicenseProduct = async (product, quantity = 1) => {
    const normalized = normalizeProduct(product);

    if (!auth.isLogin || !auth.user?.email) {
      openAlertBox("error", "Please login to purchase a license key");
      navigate("/login");
      return;
    }

    try {
      const salePrice = getSalePrice(normalized);
      const order = await placeOrder({
        name: auth.user.name || "Customer",
        phone: auth.user.phone || "0000000000",
        address: "Digital delivery — license key",
        pincode: "000000",
        total: salePrice * quantity,
        email: auth.user.email,
        userId: auth.user.email,
        items: [
          {
            productId: normalized.id,
            quantity,
            product: normalized,
          },
        ],
        paymentMethod: "card",
      });

      showLicenseKeysFromOrder(order);
      openAlertBox("success", "License key generated");
    } catch (error) {
      openAlertBox(
        "error",
        error.message || "Could not complete purchase",
      );
    }
  };

  // ================= WISHLIST =================

  const toggleWishlist = (product) => {
    if (!product) return;

    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        openAlertBox("success", "Removed from wishlist");
        return prev.filter((item) => item.id !== product.id);
      }

      openAlertBox("success", "Added to wishlist");
      return [...prev, product];
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
    clearCart,

    wishlist,
    toggleWishlist,
    isInWishlist,

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
        {/* Home */}
        <Route path="/" element={<Home />} />
        {/* ProductListing */}
        <Route path="/productListing" element={<ProductListing />} />
        {/* Cart */}
        <Route path="/cart" element={<Cart />} />
        {/* ProductDetail */}
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* Verify */}
        <Route path="/verifyAccount" element={<Verify />} />
        {/* CheckOut */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />
        {/* REGISTER */}
        <Route path="/register" element={<Register />} />
        {/* FORGOT PASSWORD */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* RESET PASSWORD */}
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* MYACCOUNT */}
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
              <MyAccount />
            </ProtectedRoute>
          }
        />
        {/* MYORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        {/* MYLISTPRODUCT */}
        <Route
          path="/my-list"
          element={
            <ProtectedRoute>
              <MyListItem />
            </ProtectedRoute>
          }
        />
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
