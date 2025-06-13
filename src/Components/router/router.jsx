import { createBrowserRouter } from "react-router-dom";


// Admin panel
import AdminPanelLayout from "../Layouts/AdminPanelLayout";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import AdminDashboard from "../AdminPanel/Pages/Dashboard/AdminDashboard";
import PosSystem from "../AdminPanel/Pages/PosSystem/PosSystem";
import Coupons from "../AdminPanel/Pages/Coupons/Coupons";
import Media from "../AdminPanel/Pages/Media/Media";
import Customers from "../AdminPanel/Pages/Customers/Customers";
import Staff from "../AdminPanel/Pages/Staff/Staff";
import Courier from "../AdminPanel/Pages/Courier/Courier";
import Transactions from "../AdminPanel/Pages/Transactions/Transactions";
import Newsletter from "../AdminPanel/Pages/Newsletter/Newsletter";
import Inqueries from "../AdminPanel/Pages/Inqueries/Inqueries";
import Jobs from "../AdminPanel/Pages/Jobs/Jobs";
import Blog from "../AdminPanel/Pages/Blog/Blog";
import FAQ from "../AdminPanel/Pages/FAQ/FAQ";
import Order from "../AdminPanel/Pages/Order/Order";
import CompletedOrder from "../AdminPanel/Pages/Order/CompletedOrder";
import NewRequest from "../AdminPanel/Pages/Order/NewRequest";
import CancelledOrder from "../AdminPanel/Pages/Order/CancelledOrder";
import ProductList from "../AdminPanel/Pages/Products/ProductList";
import Categories from "../AdminPanel/Pages/Products/Categories";
import AddProduct from "../AdminPanel/Pages/Products/AddProduct";
import ProductReview from "../AdminPanel/Pages/Products/ProductReview";
import Login from "../AdminPanel/Pages/Login/Login";

// Admin Panel Pages


const router = createBrowserRouter([
  {
    path: "/admin",
    element: <ProtectedRoute />, // Protects all children of this route
    children: [
      {
        // Pathless layout route for authenticated admin section
        // AdminPanelLayout will render its <Outlet /> for these children
        element: <AdminPanelLayout />,
        children: [
          { index: true, element: <AdminDashboard /> }, // /admin will render AdminDashboard inside AdminPanelLayout
          { path: "dashboard", element: <AdminDashboard /> }, // /admin/dashboard
          { path: "pos", element: <PosSystem /> }, // /admin/pos

          // Order Dropdown
          { path: "orders/all", element: <Order /> },
          { path: "orders/neworder", element: <NewRequest /> },
          { path: "orders/completed", element: <CompletedOrder /> },
          { path: "orders/cancelledorder", element: <CancelledOrder /> },

          // Products Dropdown
          { path: "products/all", element: <ProductList /> },
          { path: "products/categories", element: <Categories /> },
          { path: "products/add", element: <AddProduct /> },
          { path: "products/review", element: <ProductReview /> },

          { path: "coupons", element: <Coupons /> },
          { path: "media", element: <Media /> },
          { path: "customers", element: <Customers /> },
          { path: "staff", element: <Staff /> },
          { path: "courier", element: <Courier /> },
          { path: "transactions", element: <Transactions /> },
          { path: "newsletter", element: <Newsletter /> },
          { path: "inquiries", element: <Inqueries /> },
          { path: "jobs", element: <Jobs /> },
          { path: "blogs", element: <Blog /> },
          { path: "faq", element: <FAQ /> },
        ]
      },
      {
        path: "login", // /admin/login (sibling to the layout route, so not wrapped by AdminPanelLayout)
        element: <Login />,
      }
    ],
  },
  // The old "/" route is removed.
]);

export default router;
