import "./App.css";

import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./Pages/Home";
import ProductListing from "./Pages/ProductListing";

import ProductDetail from "./components/ProductDetail";
import ProductDetailModal from "./components/ProductDetailModal";

import Dialog from "@mui/material/Dialog";

const MyContext = createContext();

function App() {
  const [openProductDetailModal, setOpenProductDetailModal] =
    useState(false);

  const handleOpenProductDetailModal = () => {
    setOpenProductDetailModal(true);
  };

  const handleCloseProductDetailModal = () => {
    setOpenProductDetailModal(false);
  };

  const values = {
    handleOpenProductDetailModal,
    handleCloseProductDetailModal,
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/productListing"
            element={<ProductListing />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />
        </Routes>

        <Footer />

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
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;

export { MyContext };