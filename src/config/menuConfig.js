import {
  FaChartLine,
  FaTags,
  FaGift,
  FaImages,
  FaUsers,
  FaUserTie,
  FaTruck,
  FaMoneyCheckAlt,
  FaShoppingCart,
  FaBoxOpen,
  FaEnvelope,
  FaQuestionCircle,
  FaBriefcase,
  FaNewspaper,
  FaBell,
} from "react-icons/fa";

/** @type {import('./menuTypes').MenuItem[]} */
export const defaultMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    icon: FaChartLine,
  },
  {
    id: "pos",
    label: "POS System",
    path: "/admin/pos",
    icon: FaShoppingCart,
  },
  {
    id: "orders",
    label: "Orders",
    icon: FaTags,
    children: [
      { id: "new-orders", label: "New Request", path: "/admin/orders/new" },
      {
        id: "completed-orders",
        label: "Completed",
        path: "/admin/orders/completed",
      },
      {
        id: "cancelled-orders",
        label: "Cancelled",
        path: "/admin/orders/cancelled",
      },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: FaBoxOpen,
    children: [
      { id: "product-list", label: "Product List", path: "/admin/products" },
      {
        id: "categories",
        label: "Categories",
        path: "/admin/products/categories",
      },
      { id: "add-product", label: "Add Product", path: "/admin/products/add" },
      { id: "reviews", label: "Reviews", path: "/admin/products/reviews" },
    ],
  },
  {
    id: "coupons",
    label: "Coupons",
    path: "/admin/coupons",
    icon: FaGift,
  },
  {
    id: "media",
    label: "Media",
    path: "/admin/media",
    icon: FaImages,
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: FaUsers,
  },
  {
    id: "staff",
    label: "Staff",
    path: "/admin/staff",
    icon: FaUserTie,
  },
  {
    id: "courier",
    label: "Courier",
    path: "/admin/courier",
    icon: FaTruck,
  },
  {
    id: "transactions",
    label: "Transactions",
    path: "/admin/transactions",
    icon: FaMoneyCheckAlt,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    path: "/admin/newsletter",
    icon: FaBell,
  },
  {
    id: "inquiries",
    label: "Inquiries",
    path: "/admin/inquiries",
    icon: FaEnvelope,
  },
  {
    id: "jobs",
    label: "Jobs",
    path: "/admin/jobs",
    icon: FaBriefcase,
  },
  {
    id: "blogs",
    label: "Blogs",
    path: "/admin/blogs",
    icon: FaNewspaper,
  },
  {
    id: "faq",
    label: "FAQ",
    path: "/admin/faq",
    icon: FaQuestionCircle,
  },
];
