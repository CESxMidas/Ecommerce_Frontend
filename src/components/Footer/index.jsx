import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaHeadset,
  FaTruck,
  FaGift,
} from "react-icons/fa";

import { MdOutlinePayments } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";

import "./index.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* TOP FEATURES */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="footerFeatures">
            <div className="featureItem">
              <FaTruck className="featureIcon" />

              <div>
                <h4>Free Shipping</h4>
                <p>For all Orders Over $100</p>
              </div>
            </div>

            <div className="featureItem">
              <TbTruckReturn className="featureIcon" />

              <div>
                <h4>30 Days Returns</h4>
                <p>For an Exchange Product</p>
              </div>
            </div>

            <div className="featureItem">
              <MdOutlinePayments className="featureIcon" />

              <div>
                <h4>Secured Payment</h4>
                <p>Payment Cards Accepted</p>
              </div>
            </div>

            <div className="featureItem">
              <FaGift className="featureIcon" />

              <div>
                <h4>Special Gifts</h4>
                <p>Our First Product Order</p>
              </div>
            </div>

            <div className="featureItem">
              <FaHeadset className="featureIcon" />

              <div>
                <h4>Support 24/7</h4>
                <p>Contact us Anytime</p>
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

            <p className="footerText">Classyshop - Mega Super Store</p>

            <p className="footerText">507-Union Trade Centre France</p>

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
              <li>Prices drop</li>
              <li>New products</li>
              <li>Best sales</li>
              <li>Contact us</li>
              <li>Sitemap</li>
              <li>Stores</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="footerTitle">Our company</h3>

            <ul className="footerLinks">
              <li>Delivery</li>
              <li>Legal Notice</li>
              <li>Terms and conditions</li>
              <li>About us</li>
              <li>Secure payment</li>
              <li>Login</li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="footerTitle">Subscribe to newsletter</h3>

            <p className="footerText mb-6">
              Subscribe to our latest newsletter to get news about special
              discounts.
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
            <p className="copyright">© 2026 - Ecommerce Template</p>

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
