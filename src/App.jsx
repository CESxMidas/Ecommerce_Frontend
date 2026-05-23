import "./App.css";
import { createContext, useState } from "react";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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

import Verify from "./components/Verify";

import toast, { Toaster } from "react-hot-toast";

import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

import CheckOut from "./Pages/CheckOut";
import MyAccount from "./Pages/MyAccount";

const MyContext = createContext();

function AppContent() {
  const location = useLocation();

  // ================= UI STATE =================

  const [openCartPanel, setOpenCartPanel] = useState(false);

  const [openProductDetailModal, setOpenProductDetailModal] = useState(false);

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

  // ================= PRODUCT MODAL =================

  const handleOpenProductDetailModal = () => {
    setOpenProductDetailModal(true);
  };

  const handleCloseProductDetailModal = () => {
    setOpenProductDetailModal(false);
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

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));

    setAuth({
      isLogin: true,
      user: userData,
    });

    openAlertBox("success", "Login Success");
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

  // ================= CONTEXT =================

  const values = {
    handleOpenProductDetailModal,
    handleCloseProductDetailModal,

    openCartPanel,
    setOpenCartPanel,

    openAlertBox,

    // auth
    isLogin: auth.isLogin,

    user: auth.user,

    login,
    logout,
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
          element={auth.isLogin ? <CheckOut /> : <Login />}
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
        <Route path="/myaccount" element={<MyAccount />} />
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
