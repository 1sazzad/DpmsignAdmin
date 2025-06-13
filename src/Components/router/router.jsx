import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../AdminPanel/Pages/Login/Login.jsx";
import AdminDashboard from "../AdminPanel/Pages/Dashboard/AdminDashboard.jsx";
import AdminPanelLayout from "../Layouts/AdminPanelLayout.jsx";
import Order from "../AdminPanel/Pages/Order/Order.jsx";
import NewRequest from "../AdminPanel/Pages/Order/NewRequest.jsx";
import CompletedOrder from "../AdminPanel/Pages/Order/CompletedOrder.jsx";
import CancelledOrder from "../AdminPanel/Pages/Order/CancelledOrder.jsx";
import PosSystem from "../AdminPanel/Pages/PosSystem/PosSystem.jsx";
import ProductList from "../AdminPanel/Pages/Products/ProductList.jsx";
import Categories from "../AdminPanel/Pages/Products/Categories.jsx";
import AddProduct from "../AdminPanel/Pages/Products/AddProduct.jsx";
import ProductReview from "../AdminPanel/Pages/Products/ProductReview.jsx";
import Coupons from "../AdminPanel/Pages/Coupons/Coupons.jsx";
import Media from "../AdminPanel/Pages/Media/Media.jsx";
import Customers from "../AdminPanel/Pages/Customers/Customers.jsx";
import Staff from "../AdminPanel/Pages/Staff/Staff.jsx";
import Courier from "../AdminPanel/Pages/Courier/Courier.jsx";
import Transactions from "../AdminPanel/Pages/Transactions/Transactions.jsx";
import Newsletter from "../AdminPanel/Pages/Newsletter/Newsletter.jsx";
import Inqueries from "../AdminPanel/Pages/Inqueries/Inqueries.jsx";
import Jobs from "../AdminPanel/Pages/Jobs/Jobs.jsx";
import Blog from "../AdminPanel/Pages/Blog/Blog.jsx";
import FAQ from "../AdminPanel/Pages/FAQ/FAQ.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin/dashboard" replace />,
  },
  // Redirects for non-admin routes
  {
    path: "/dashboard",
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "/orders/*",
    element: <Navigate to="/admin/orders/all" replace />,
  },
  {
    path: "/pos",
    element: <Navigate to="/admin/pos" replace />,
  },
  {
    path: "/products/*",
    element: <Navigate to="/admin/products/all" replace />,
  },
  {
    path: "/coupons",
    element: <Navigate to="/admin/coupons" replace />,
  },
  {
    path: "/media",
    element: <Navigate to="/admin/media" replace />,
  },
  {
    path: "/customers",
    element: <Navigate to="/admin/customers" replace />,
  },
  {
    path: "/staff",
    element: <Navigate to="/admin/staff" replace />,
  },
  {
    path: "/courier",
    element: <Navigate to="/admin/courier" replace />,
  },
  {
    path: "/transactions",
    element: <Navigate to="/admin/transactions" replace />,
  },
  {
    path: "/newsletter",
    element: <Navigate to="/admin/newsletter" replace />,
  },
  {
    path: "/inquiries",
    element: <Navigate to="/admin/inquiries" replace />,
  },
  {
    path: "/jobs",
    element: <Navigate to="/admin/jobs" replace />,
  },
  {
    path: "/blogs",
    element: <Navigate to="/admin/blogs" replace />,
  },
  {
    path: "/faq",
    element: <Navigate to="/admin/faq" replace />,
  },
  {
    path: "/admin",
    element: <AdminPanelLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "pos",
        element: <PosSystem />,
      },
      {
        path: "orders",
        children: [
          {
            path: "all",
            element: <Order />,
          },
          {
            path: "new",
            element: <NewRequest />,
          },
          {
            path: "completed",
            element: <CompletedOrder />,
          },
          {
            path: "cancelled",
            element: <CancelledOrder />,
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            path: "all",
            element: <ProductList />,
          },
          {
            path: "categories",
            element: <Categories />,
          },
          {
            path: "add",
            element: <AddProduct />,
          },
          {
            path: "review",
            element: <ProductReview />,
          },
        ],
      },
      {
        path: "coupons",
        element: <Coupons />,
      },
      {
        path: "media",
        element: <Media />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "staff",
        element: <Staff />,
      },
      {
        path: "courier",
        element: <Courier />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "newsletter",
        element: <Newsletter />,
      },
      {
        path: "inquiries",
        element: <Inqueries />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "blogs",
        element: <Blog />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
    ],
  },
]);

export default router;
