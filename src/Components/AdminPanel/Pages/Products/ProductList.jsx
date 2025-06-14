import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../api/axiosInstance'; // Adjust path as per your structure
// import { Link } from 'react-router-dom'; // If you have add/edit product links

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state (optional, but good for many products)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 10; // Or make this configurable

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
            // Backend endpoint supports pagination: /product?page=1&limit=10 (singular 'product')
            const response = await axiosInstance.get(`/product?page=${currentPage}&limit=${productsPerPage}`);
        if (response.data && response.data.data) {
          setProducts(response.data.data);
          setTotalPages(response.data.totalPages || 1);
          setTotalProducts(response.data.totalProducts || 0);
        } else {
          setProducts([]); // Ensure products is an array
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.message || 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]); // Refetch when currentPage changes

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // TODO: Implement delete product functionality
  // const handleDelete = async (productId) => {
  //   if (window.confirm('Are you sure you want to delete this product?')) {
  //     try {
  //       await axiosInstance.delete(`/products/${productId}`);
  //       setProducts(products.filter(p => p.id !== productId));
  //       // Add a success notification
  //     } catch (err) {
  //       console.error("Error deleting product:", err);
  //       setError(err.response?.data?.message || 'Failed to delete product.');
  //       // Add an error notification
  //     }
  //   }
  // };


  if (loading) {
    return <div className="p-4 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Product List</h1>
        {/* <Link to="/admin/products/add" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150">
          Add New Product
        </Link> */}
      </div>

      {products.length === 0 && !loading ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm bg-white">
                    <p className="text-gray-900 whitespace-no-wrap">{product.name}</p>
                  </td>
                  <td className="px-5 py-4 text-sm bg-white">
                    <p className="text-gray-900 whitespace-no-wrap">{product.category_name || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-4 text-sm bg-white">
                    <p className="text-gray-900 whitespace-no-wrap">${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-4 text-sm bg-white">
                    <p className="text-gray-900 whitespace-no-wrap">{product.stock_quantity}</p>
                  </td>
                  <td className="px-5 py-4 text-sm bg-white whitespace-no-wrap">
                    {/* <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link> */}
                    {/* <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button> */}
                     <span className="text-gray-400">No actions</span> {/* Placeholder */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {products.length > 0 && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages} (Total: {totalProducts} products)
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
