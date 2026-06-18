import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaHeadset,
  FaBolt,
  FaKey,
} from "react-icons/fa";

import { MdOutlinePayments } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";
import { Link } from "react-router-dom";

import "./index.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* TOP FEATURES */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="footerFeatures">
            <div className="featureItem">
              <FaBolt className="featureIcon" />

              <div>
                <h4>Instant Delivery</h4>
                <p>Digital keys after checkout</p>
              </div>
            </div>

            <div className="featureItem">
              <TbTruckReturn className="featureIcon" />

              <div>
                <h4>Refund Review</h4>
                <p>Support for key issues</p>
              </div>
            </div>

            <div className="featureItem">
              <MdOutlinePayments className="featureIcon" />

              <div>
                <h4>Secure Payment</h4>
                <p>Protected checkout flow</p>
              </div>
            </div>

            <div className="featureItem">
              <FaKey className="featureIcon" />

              <div>
                <h4>Genuine Keys</h4>
                <p>Verified digital licenses</p>
              </div>
            </div>

            <div className="featureItem">
              <FaHeadset className="featureIcon" />

              <div>
                <h4>Activation Support</h4>
                <p>Help when setup fails</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
          {/* CONTACT */}
          <div>
            <h3 className="footerTitle">Contact us</h3>

            <p className="footerText">KEYSHOP - Digital License Store</p>

            <p className="footerText">Software keys, gaming products and activation support</p>

            <p className="footerText mt-6">hoangdohuy0907@gmail.com</p>

            <h3 className="text-[28px] font-bold text-blue-400 mt-4">
              +84 941 383 007
            </h3>

            <div className="chatBox">
              <FaHeadset className="text-[30px]" />

              <div>
                <h4>Online Chat</h4>
                <p>Get Expert Help</p>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <div>
            <h3 className="footerTitle">Products</h3>

            <ul className="footerLinks">
              <li><Link to="/deals?sort=popular">Prices drop</Link></li>
              <li><Link to="/productListing?sort=new">New products</Link></li>
              <li><Link to="/deals?sort=popular">Best sales</Link></li>
              <li><Link to="/contact">Contact us</Link></li>
              <li><Link to="/blog">Articles</Link></li>
              <li><Link to="/track-order">Order tracking</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="footerTitle">Our company</h3>

            <ul className="footerLinks">
              <li><Link to="/shipping">Delivery</Link></li>
              <li><Link to="/privacy-policy">Legal Notice</Link></li>
              <li><Link to="/terms">Terms and conditions</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/payment-policy">Secure payment</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="footerTitle">Subscribe to newsletter</h3>

            <p className="footerText mb-6">
              Subscribe to our latest newsletter to get news about special
              discounts and software updates.
            </p>

            <div className="newsletterBox">
              <input type="email" placeholder="Your Email Address" />

              <button>SUBSCRIBE</button>
            </div>

            <div className="termsBox">
              <input type="checkbox" />

              <p>I agree to the terms and conditions and the privacy policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footerBottom">
        <div className="container mx-auto px-6">
          <div className="footerBottomWrapper">
            {/* SOCIAL */}
            <div className="socialIcons">
              <button>
                <FaFacebookF />
              </button>

              <button>
                <FaYoutube />
              </button>

              <button>
                <FaPinterestP />
              </button>

              <button>
                <FaInstagram />
              </button>
            </div>

            {/* COPYRIGHT */}
            <p className="copyright">Copyright 2026 - KEYSHOP</p>

            {/* PAYMENT */}
            <img
              src="https://i.imgur.com/D9jR4YQ.png"
              alt=""
              className="paymentImage"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
