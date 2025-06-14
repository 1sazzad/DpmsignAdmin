import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../api/axiosInstance'; // Adjust path

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for adding/editing a category (optional inline form)
  // const [newCategoryName, setNewCategoryName] = useState('');
  // const [newCategoryDescription, setNewCategoryDescription] = useState('');
  // const [isAdding, setIsAdding] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
            // The backend route for categories is /api/v1/product-category
            const response = await axiosInstance.get('/product-category'); // Updated path
        setCategories(response.data || []); // Ensure categories is an array
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.message || 'Failed to fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // TODO: Implement Add/Edit/Delete category functions
  // const handleAddCategory = async (e) => { ... };
  // const handleDeleteCategory = async (categoryId) => { ... };

  if (loading) {
    return <div className="p-4 text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Categories</h1>
        {/* <button onClick={() => setIsAdding(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
          Add New Category
        </button> */}
      </div>

      {/* Optional: Form for adding a new category inline
      {isAdding && (
        <div className="mb-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Add New Category</h2>
          <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Category Name" className="w-full p-2 border rounded mb-2" />
          <textarea value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)} placeholder="Description (Optional)" className="w-full p-2 border rounded mb-2"></textarea>
          <button onClick={handleAddCategory} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Save</button>
          <button onClick={() => setIsAdding(false)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
        </div>
      )}
      */}

      {categories.length === 0 && !loading ? (
         <p className="text-gray-600">No categories found.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm bg-white">
                    <p className="text-gray-900 whitespace-no-wrap">{category.name}</p>
                  </td>
                  <td className="px-5 py-4 text-sm bg-white">
                    <p className="text-gray-900 whitespace-no-wrap">{category.description || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-4 text-sm bg-white whitespace-no-wrap">
                    {/* <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button> */}
                    {/* <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-900">Delete</button> */}
                    <span className="text-gray-400">No actions</span> {/* Placeholder */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
