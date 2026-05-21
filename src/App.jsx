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
const MyContext = createContext();
function AppContent() {
  const location = useLocation();
  const [
    openCartPanel,
    setOpenCartPanel,
    openProductDetailModal,
    setOpenProductDetailModal,
  ] = useState(false);

  const handleOpenProductDetailModal = () => {
    setOpenProductDetailModal(true);
  };
  const handleCloseProductDetailModal = () => {
    setOpenProductDetailModal(false);
  };
  const values = {
    handleOpenProductDetailModal,
    handleCloseProductDetailModal,
    openCartPanel,
    setOpenCartPanel,
  };
  // HIDE HEADER FOOTER
  const authPages =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <MyContext.Provider value={values}>
      {!authPages && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productListing" element={<ProductListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />
        {/* REGISTER */}
        <Route path="/register" element={<Register />} />
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
      <CartPanel />
    </MyContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

export { MyContext };
