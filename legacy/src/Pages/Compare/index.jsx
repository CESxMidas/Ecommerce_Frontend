import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaRegTrashAlt, FaShoppingCart } from "react-icons/fa";
import { MyContext } from "../../App";
import {
  getDeliveryLabel,
  getProductDisplayName,
  getProductThumbnail,
  getProductTypeLabel,
  getSalePrice,
} from "../../utils/productSchema";
import { formatPrice } from "../../utils/products";

const rows = [
  ["Vendor", (item) => item.vendor || item.brand || "-"],
  ["Category", (item) => item.categoryName || "-"],
  ["Price", (item) => formatPrice(getSalePrice(item))],
  ["Rating", (item) => `${Number(item.rating || 0).toFixed(1)} / 5`],
  ["Reviews", (item) => item.reviewsCount || 0],
  ["Stock", (item) => (item.stock > 0 ? `${item.stock} available` : "Out of stock")],
  ["Type", (item) => getProductTypeLabel(item)],
  ["Delivery", (item) => getDeliveryLabel(item)],
  ["SKU", (item) => item.sku || "-"],
];

const Compare = () => {
  const context = useContext(MyContext);
  const items = context.compareItems || [];

  return (
    <main className="commercePage">
      <div className="container">
        <div className="commerceShell">
          <header className="commerceHero">
            <span className="commerceKicker">Compare</span>
            <h1>Compare Products</h1>
            <p>
              Compare up to four products side by side before adding the right
              license to your cart.
            </p>
          </header>

          {items.length === 0 ? (
            <section className="commercePanel">
              <h2>No products selected</h2>
              <p>Use the compare icon on product cards to add items here.</p>
              <div className="commerceActions">
                <Link to="/productListing" className="commerceBtn">
                  Browse products
                </Link>
              </div>
            </section>
          ) : (
            <section className="commercePanel">
              <div className="compareToolbar">
                <Link to="/productListing" className="commerceGhostBtn">
                  Add more products
                </Link>
                <button
                  type="button"
                  className="commerceBtn"
                  onClick={context.clearCompare}
                >
                  Clear compare
                </button>
              </div>

              <div className="compareTableWrap">
                <table className="compareTable">
                  <thead>
                    <tr>
                      <th>Product</th>
                      {items.map((item) => (
                        <th key={item.id}>
                          <div className="compareProductHead">
                            <img
                              src={getProductThumbnail(item)}
                              alt={getProductDisplayName(item)}
                            />
                            <Link to={`/product/${item.slug || item.id}`}>
                              {getProductDisplayName(item)}
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(([label, getValue]) => (
                      <tr key={label}>
                        <td>{label}</td>
                        {items.map((item) => (
                          <td key={`${item.id}-${label}`}>{getValue(item)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td>Action</td>
                      {items.map((item) => (
                        <td key={`${item.id}-action`}>
                          <div className="compareActions">
                            <button
                              type="button"
                              className="commerceBtn"
                              onClick={() => context.addToCart(item)}
                            >
                              <FaShoppingCart /> Add
                            </button>
                            <button
                              type="button"
                              className="commerceGhostBtn compareIconBtn"
                              onClick={() => context.removeFromCompare(item.id)}
                              aria-label="Remove from compare"
                            >
                              <FaRegTrashAlt />
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Compare;
