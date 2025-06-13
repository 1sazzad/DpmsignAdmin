import { useState } from "react";
import {
  FaChartLine, FaTags, FaGift, FaImages, FaUsers, FaUserTie, FaTruck, FaMoneyCheckAlt,
  FaShoppingCart, FaBoxOpen, FaChevronDown, FaChevronUp, FaSearch, FaUserCircle,
  FaEnvelope, FaQuestionCircle, FaBriefcase, FaNewspaper, FaBell, FaAngleDoubleLeft, FaAngleDoubleRight
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({ order: false, products: false });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className={`min-h-screen bg-base-200 ${isCollapsed ? "w-20" : "w-64"} duration-300 relative`}>
      
      {/* Toggle Collapse Icon (Right side) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-5 -right-4 bg-white border border-gray-300 rounded-full shadow p-1 z-50"
      >
        {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 p-4">
        {/* <img src="/logo.png" alt="Logo" className="w-10 h-10" /> */}
        {!isCollapsed && <h2 className="text-lg font-bold">Dhaka Plastic & Metal</h2>}
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-4 mb-2">
          <div className="flex items-center bg-white rounded shadow px-2 py-1">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 bg-transparent outline-none w-full"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-2 space-y-1">
        <Link to='/dashboard'><SidebarItem  icon={<FaChartLine />} label="Dashboard" collapsed={isCollapsed} /></Link>
       <Link to='/pos'> <SidebarItem icon={<FaShoppingCart />} label="POS System" collapsed={isCollapsed} /></Link>

        {/* Dropdown Menus */}
        <SidebarItem
  icon={<FaTags />}
  label="Order"
  collapsed={isCollapsed}
  isDropdown
  isOpen={openMenus.order}
  onClick={() => toggleMenu("order")}
>
  {openMenus.order && !isCollapsed && (
    <div className="ml-14 text-gray-700 space-y-1">
      <Link to="/orders/all" className="hover:underline block">All Orders</Link>
      <Link to="/orders/neworder" className="hover:underline block">Pending</Link>
      <Link to="/orders/completed" className="hover:underline block">Completed</Link>
      <Link to="/orders/cancelledorder" className="hover:underline block">Cancelled</Link>
    </div>
  )}
</SidebarItem>


        <SidebarItem
  icon={<FaBoxOpen />}
  label="Products"
  collapsed={isCollapsed}
  isDropdown
  isOpen={openMenus.products}
  onClick={() => toggleMenu("products")}
>
  {openMenus.products && !isCollapsed && (
    <div className="ml-14 text-gray-700 space-y-1">
      <Link to="/products/all" className="hover:underline block">All Products</Link>
      <Link to="/products/categories" className="hover:underline block">Categories</Link>
      <Link to="/products/add" className="hover:underline block">Add Product</Link>
      <Link to="/products/review" className="hover:underline block">Product Review</Link>
    </div>
  )}
</SidebarItem>


        {/* Static Items */}
        <Link to='/coupons'><SidebarItem icon={<FaGift />} label="Coupons" collapsed={isCollapsed} /></Link>
        <Link to='/media'><SidebarItem icon={<FaImages />} label="Media" collapsed={isCollapsed} /></Link>
        <Link to='/customers'><SidebarItem icon={<FaUsers />} label="Customers" collapsed={isCollapsed} /></Link>
        <Link to='/staff'><SidebarItem icon={<FaUserTie />} label="Staff" collapsed={isCollapsed} /></Link>
        <Link to='/courier'><SidebarItem icon={<FaTruck />} label="Courier" collapsed={isCollapsed} /></Link>
        <Link to='/transactions'><SidebarItem icon={<FaMoneyCheckAlt />} label="Transactions" collapsed={isCollapsed} /></Link>
        <Link to='/newsletter'><SidebarItem icon={<FaBell />} label="Newsletter" collapsed={isCollapsed} /></Link>

        <Link to='/inquiries'><SidebarItem icon={<FaEnvelope />} label="Inquiries" collapsed={isCollapsed} /></Link>
        <Link to='/jobs'> <SidebarItem icon={<FaBriefcase />} label="Jobs" collapsed={isCollapsed} /></Link>
        <Link to='/blogs'><SidebarItem icon={<FaNewspaper />} label="Blogs" collapsed={isCollapsed} /></Link>
        <Link to='/faq'><SidebarItem icon={<FaQuestionCircle />} label="FAQ" collapsed={isCollapsed} /></Link>
        
        
       
        
        
      </nav>

      {/* Admin Footer */}
      <div className="absolute bottom-0 w-full p-4 bg-base-100 border-t">
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-3xl" />
          {!isCollapsed && (
            <div>
              <h4 className="text-sm font-semibold">Admin</h4>
              <p className="text-xs text-gray-500">admin@dpmsign.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, collapsed, isDropdown = false, isOpen, onClick, children }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full px-4 py-2 hover:bg-[#45B6E7] hover:text-white rounded transition"
      >
        <span className="flex items-center gap-3">
          {icon}
          {!collapsed && <span>{label}</span>}
        </span>
        {!collapsed && isDropdown && (isOpen ? <FaChevronUp /> : <FaChevronDown />)}
      </button>
      {children}
    </div>
  );
}

function DropdownItems({ items }) {
  return (
    <div className="ml-10 text-sm text-gray-700 space-y-1">
      {items.map((item, index) => (
        <div key={index} className="hover:underline cursor-pointer">
          {item}
        </div>
      ))}
    </div>
  );
}
