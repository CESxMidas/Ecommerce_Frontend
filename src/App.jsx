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
import Dialog from "@mui/material/Dialog";
import Register from "./Pages/Register";
import CartPanel from "./components/CartPanel";
import Cart from "./Pages/Cart";
import Verify from "./components/Verify";
import toast, { Toaster } from "react-hot-toast";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import CheckOut from "./Pages/CheckOut";

const MyContext = createContext();
function AppContent() {
  const location = useLocation();
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openProductDetailModal, setOpenProductDetailModal] = useState(false);
  const handleOpenProductDetailModal = () => {
    setOpenProductDetailModal(true);
  };
  const handleCloseProductDetailModal = () => {
    setOpenProductDetailModal(false);
  };
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
  const values = {
    handleOpenProductDetailModal,
    handleCloseProductDetailModal,
    openCartPanel,
    setOpenCartPanel,
    openAlertBox,
  };
  // HIDE HEADER FOOTER
  const authPages =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verifyAccount" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";
  return (
    <MyContext.Provider value={values}>
      {!authPages && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productListing" element={<ProductListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/verifyAccount" element={<Verify />} />
        {/* checkout */}
        <Route path="/checkout" element={<CheckOut />} />
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />
        {/* REGISTER */}
        <Route path="/register" element={<Register />} />
        {/*FORGOT PASSWORD */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/*RESET PASSWORD*/}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
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
