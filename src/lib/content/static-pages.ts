export type StaticPageSection = {
  title: string;
  body: string;
};

export type StaticPageContent = {
  kicker: string;
  title: string;
  intro: string;
  sections: StaticPageSection[];
};

export const STATIC_PAGES: Record<string, StaticPageContent> = {
  about: {
    kicker: "Company",
    title: "About KEYSHOP",
    intro:
      "KEYSHOP is a digital ecommerce store focused on software keys, gaming products and fast digital delivery.",
    sections: [
      {
        title: "What we sell",
        body: "We focus on digital products such as software licenses, game-related tools and downloadable products that can be delivered quickly after checkout.",
      },
      {
        title: "Our standard",
        body: "Product pages, order status, support, payment handling and license delivery are designed to be clear so customers can buy with confidence.",
      },
    ],
  },
  contact: {
    kicker: "Support",
    title: "Contact Us",
    intro:
      "Need help with an order, product activation or account issue? Contact our support team with your order ID and account email.",
    sections: [
      { title: "Email", body: "hoangdohuy0907@gmail.com" },
      { title: "Phone", body: "+84 941 383 007" },
      {
        title: "Support hours",
        body: "Support requests are reviewed daily. Include screenshots and your order ID for faster handling.",
      },
    ],
  },
  "help-center": {
    kicker: "Support",
    title: "Help Center",
    intro: "Find quick answers for orders, payments, digital delivery and account access.",
    sections: [
      {
        title: "Order help",
        body: "Use the order tracking page to check status. Logged-in customers can also open My Orders for full order details.",
      },
      {
        title: "License keys",
        body: "License key products are shown after successful purchase and remain visible inside your order details.",
      },
      {
        title: "Account help",
        body: "Use forgot password or email verification pages if you cannot access your account.",
      },
    ],
  },
  terms: {
    kicker: "Legal",
    title: "Terms and Conditions",
    intro: "These terms describe the basic rules for using the store and purchasing digital products.",
    sections: [
      {
        title: "Orders",
        body: "Customers are responsible for providing accurate account, contact and payment information before placing an order.",
      },
      {
        title: "Digital products",
        body: "Digital items may be delivered immediately after successful payment, so cancellation options can be limited once delivery starts.",
      },
      {
        title: "Account usage",
        body: "You are responsible for keeping your account credentials secure and for all activity made through your account.",
      },
    ],
  },
  "privacy-policy": {
    kicker: "Legal",
    title: "Privacy Policy",
    intro: "This page explains the main customer data used to operate orders, accounts and support.",
    sections: [
      {
        title: "Data we use",
        body: "We use account details, contact information, order items and payment status to process purchases and provide support.",
      },
      {
        title: "Why we use data",
        body: "Customer data is used for authentication, order fulfillment, payment verification, fraud prevention and support requests.",
      },
      {
        title: "Customer control",
        body: "Customers can update profile and address details from their account pages where supported.",
      },
    ],
  },
  returns: {
    kicker: "Policy",
    title: "Return and Refund Policy",
    intro: "Digital ecommerce needs clear refund rules because many products are delivered instantly.",
    sections: [
      {
        title: "Eligible cases",
        body: "Refund or replacement may be reviewed when the delivered key is invalid, duplicate or not delivered due to a system issue.",
      },
      {
        title: "Non-refundable cases",
        body: "Activated, redeemed or successfully delivered digital products may not be refundable unless required by support review.",
      },
      {
        title: "How to request",
        body: "Contact support with order ID, product name, screenshots and a clear description of the issue.",
      },
    ],
  },
  shipping: {
    kicker: "Policy",
    title: "Shipping and Delivery",
    intro:
      "Most products in this store are digital and delivered through the order system rather than physical shipping.",
    sections: [
      {
        title: "Digital delivery",
        body: "License keys and digital products are attached to your order after checkout and can be viewed from order details.",
      },
      {
        title: "Delivery delays",
        body: "Some orders can be delayed while payment, inventory or fraud checks complete.",
      },
    ],
  },
  "payment-policy": {
    kicker: "Policy",
    title: "Secure Payment",
    intro:
      "Payments are processed through supported payment providers and order status is updated after confirmation.",
    sections: [
      {
        title: "Payment status",
        body: "Orders can show pending, paid, failed or cancelled states depending on provider confirmation.",
      },
      {
        title: "Payment retry",
        body: "If payment fails or expires, use My Orders to review available retry options.",
      },
    ],
  },
};

export function getStaticPage(slug: string): StaticPageContent | null {
  return STATIC_PAGES[slug] || null;
}
