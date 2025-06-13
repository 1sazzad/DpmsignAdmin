import {
  FaFileCsv,
  FaFileExcel,
  FaSearch,
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState("default");
  const [filterTab, setFilterTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    axios
      .get("https://test.api.dpmsign.com/api/product")
      .then((res) => {
        const data = res.data.data.products;
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);
  
  useEffect(() => {
  let updatedList = [...products];

  // Apply tab filters first
  if (filterTab === "active") {
    updatedList = updatedList.filter((item) => item.isActive);
  } else if (filterTab === "inactive") {
    updatedList = updatedList.filter((item) => !item.isActive);
  }

  // Then apply search filter
  if (searchTerm.trim()) {
    updatedList = updatedList.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredProducts(updatedList);
}, [searchTerm, filterTab, products]);

  // sort product
  const sortProducts = (type) => {
    let sorted = [...products];
    switch (type) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceLow":
        sorted.sort((a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice));
        break;
      case "priceHigh":
        sorted.sort((a, b) => parseFloat(b.basePrice) - parseFloat(a.basePrice));
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "recent":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        sorted = [...products]; // default reset
    }
    setSortType(type);
    setFilteredProducts(sorted);
  };


  // toggle Status
 const toggleStatus = async (productId, currentStatus) => {
  const newStatus = !currentStatus;
  try {
    await axios.put(`https://test.api.dpmsign.com/api/product/status/${productId}`, {
      isActive: newStatus,
    });

    // Update local state only if API call is successful
    setFilteredProducts((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, isActive: newStatus } : item
      )
    );

    // Optional: Also update full product list
    setProducts((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, isActive: newStatus } : item
      )
    );
  } catch (err) {
    console.error("Failed to update status:", err);
  }
};



  // filter tab
  const handleFilterTab = (tab) => {
    setFilterTab(tab);

    if (tab === "active") {
      setFilteredProducts(products.filter((item) => item.isActive));
    } else if (tab === "inactive") {
      setFilteredProducts(products.filter((item) => !item.isActive));
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between border-b-2 pb-8">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
        <p className="text-gray-500">All products of your store in one place!</p>
        </div>
        <div className="flex flex-wrap gap-2">
         <input
  type="text"
  placeholder="Search by product name"
  className="input input-bordered input-sm w-52"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

          <Link to='/products/add'><button className="btn btn-info btn-sm">
            <FaPlus className="mr-1" /> Add Product
          </button></Link>
          
        </div>
      </div>

      

      {/* Top Actions */}
      <div className="flex flex-wrap justify-between items-center pt-6 mb-4 gap-2">
        <div className="space-x-2">
          <button className="btn btn-success btn-sm">
            <FaFileExcel className="mr-1" /> Export Excel
          </button>
          <button className="btn btn-primary btn-sm">
            <FaFileCsv className="mr-1" /> Export CSV
          </button>
        </div>

        <div className="flex gap-2">
          <select className="select select-bordered select-sm">
            <option>Filter by Category</option>
          </select>
          <select
            className="select select-bordered select-sm"
            value={sortType}
            onChange={(e) => sortProducts(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="name">Sort by Name</option>
            <option value="priceLow">Price (Low to High)</option>
            <option value="priceHigh">Price (High to Low)</option>
            <option value="oldest">Old Items</option>
            <option value="recent">Recent Items</option>
          </select>
          <select className="select select-bordered select-sm">
            <option>Show items</option>
          </select>
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="tabs tabs-bordered">
          <a
            className={`tab ${filterTab === "all" ? "tab-active" : ""}`}
            onClick={() => handleFilterTab("all")}
          >
            All
          </a>
          <a
            className={`tab ${filterTab === "active" ? "tab-active" : ""}`}
            onClick={() => handleFilterTab("active")}
          >
            Active
          </a>
          <a
            className={`tab ${filterTab === "inactive" ? "tab-active" : ""}`}
            onClick={() => handleFilterTab("inactive")}
          >
            Inactive
          </a>
        </div>

        
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="table table-sm">
          <thead className="bg-base-200">
            <tr>
              <th><input type="checkbox" /></th>
              <th>Image</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Base Price (Tk)</th>
              <th>Min Order Quantity</th>
              <th>Pricing Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts?.map((item) => (
              <tr key={item.productId}>
                <td><input type="checkbox" /></td>
                <td>
                  <img
                    src={item.images.imageName}
                    alt="product"
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td>{item.name}</td>
                <td><button className="bg-blue-200 rounded">{item.sku}</button></td>
                <td>{item.basePrice} Tk</td>
                <td>{item.minOrderQuantity} </td>
                <td>{item.pricingType}</td>
                <td>{item.category}</td>

                {/* Status */}
                <td>
  <div className="dropdown mt-3">
    <label
      tabIndex={0}
      className={`btn btn-sm ${item.isActive ? "btn-success" : "btn-error"} text-white`}
    >
      {item.isActive ? "Active" : "Inactive"}
    </label>
    <ul
      tabIndex={0}
      className="dropdown-content menu shadow bg-base-100 rounded-box w-28 z-10"
    >
      <li>
        <button onClick={() => toggleStatus(item.productId, true)}>
          Active
        </button>
      </li>
      <li>
        <button onClick={() => toggleStatus(item.productId, false)}>
          Inactive
        </button>
      </li>
    </ul>
  </div>
</td>

                 <td>
  {new Date(item.createdAt).toLocaleDateString("en-GB")}
</td>

                {/* Actions */}
                <td>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-xs">
                      <FaEllipsisV />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-28 text-sm"
                    >
                      <li>
                        <button className="flex items-center gap-2">
                          <FaSearch /> View
                        </button>
                      </li>
                      <li>
                        <button className="flex items-center gap-2">
                          <FaEdit /> Edit
                        </button>
                      </li>
                      <li>
                        <button className="flex items-center gap-2 text-red-500">
                          <FaTrash /> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2 text-sm text-center text-gray-500">
          Showing {filteredProducts?.length} entries
        </div>
      </div>
    </div>
  );
}
