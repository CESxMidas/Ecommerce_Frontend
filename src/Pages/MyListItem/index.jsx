import { useContext } from "react";
import { Link } from "react-router-dom";
import AccountSidebar from "../AccountSidebar";
import ProductItem from "../../components/ProductItem";
import { MyContext } from "../../App";
import "./index.css";

const MyListItem = () => {
  const context = useContext(MyContext);
  const { wishlist } = context;
  const isEmpty = wishlist.length === 0;

  return (
    <section className="myList">
      <div className="container">
        <div className="myList__wrapper">
          <AccountSidebar />

          <div className="myList__content">
            <div className="myList__header">
              <h2>My List</h2>

              <p>
                There are <span>{wishlist.length}</span> products in your
                My List
              </p>
            </div>

            {isEmpty ? (
              <div className="myList__empty">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                  alt=""
                />

                <h3>Your wishlist is empty</h3>

                <p>
                  Save your favorite products to your wishlist and shop them
                  later anytime.
                </p>

                <Link to="/productListing">CONTINUE SHOPPING</Link>
              </div>
            ) : (
              <div
                className="productGrid grid4"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "20px",
                }}
              >
                {wishlist.map((item) => (
                  <ProductItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyListItem;
