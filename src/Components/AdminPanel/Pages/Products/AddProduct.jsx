// src/Components/AdminPanel/Pages/Products/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../api/axiosInstance'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    slug: '', // Optional: backend can generate if empty
    sku: '',
    basePrice: '',
    minOrderQuantity: 1,
    pricingType: 'flat', // Default, matches your schema enum
    isActive: true,
    categoryId: '',
    // Add other fields from your Products schema as needed:
    // discountStart: null,
    // discountEnd: null,
    // discountPercentage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/products/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError('Failed to fetch categories. Please try again.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Basic slug generator (can be improved)
  const generateSlug = (name) => {
      if (!name) return '';
      return name.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setProductData(prev => ({
        ...prev,
        name: newName,
        slug: generateSlug(newName) // Auto-generate slug when name changes
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!productData.name || !productData.basePrice || !productData.sku || !productData.pricingType || !productData.categoryId) {
      setError('Please fill in all required fields: Name, SKU, Base Price, Pricing Type, and Category.');
      setLoading(false);
      return;
    }

    // Convert basePrice to number if it's not already
    const payload = {
        ...productData,
        basePrice: parseFloat(productData.basePrice),
        minOrderQuantity: parseInt(productData.minOrderQuantity, 10),
        // Ensure numeric fields are numbers, nulls for optional empty numerics
        discountPercentage: productData.discountPercentage ? parseFloat(productData.discountPercentage) : null,
        // Ensure discountStart and discountEnd are null if empty, or valid dates if provided
        discountStart: productData.discountStart || null,
        discountEnd: productData.discountEnd || null,
    };

    try {
      await axiosInstance.post('/products', payload);
      setSuccess('Product added successfully!');
      // Optionally clear form or navigate
      // setProductData({ name: '', description: '', slug: '', sku: '', basePrice: '', minOrderQuantity: 1, pricingType: 'flat', isActive: true, categoryId: '' });
      setTimeout(() => navigate('/admin/products/all'), 1500); // Navigate after a short delay
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Product</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            name="name"
            id="name"
            value={productData.name}
            onChange={handleNameChange} // Use specific handler to update slug too
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly) *</label>
          <input
            type="text"
            name="slug"
            id="slug"
            value={productData.slug}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            // Consider making this read-only if always auto-generated, or allow override
          />
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit) *</label>
          <input
            type="text"
            name="sku"
            id="sku"
            value={productData.sku}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            id="description"
            rows="4"
            value={productData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="categoryId"
            id="categoryId"
            value={productData.categoryId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
              <input
                type="number"
                name="basePrice"
                id="basePrice"
                value={productData.basePrice}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="minOrderQuantity" className="block text-sm font-medium text-gray-700 mb-1">Min. Order Quantity</label>
              <input
                type="number"
                name="minOrderQuantity"
                id="minOrderQuantity"
                value={productData.minOrderQuantity}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                min="1"
              />
            </div>
        </div>

        <div>
          <label htmlFor="pricingType" className="block text-sm font-medium text-gray-700 mb-1">Pricing Type *</label>
          <select
            name="pricingType"
            id="pricingType"
            value={productData.pricingType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="flat">Flat</option>
            <option value="square-feet">Square Feet</option>
            {/* Add other pricing types from your schema if any */}
          </select>
        </div>

        {/* Optional Discount Fields - uncomment and adapt if needed
        <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700 px-1">Discount (Optional)</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <div>
                    <label htmlFor="discountStart" className="block text-xs font-medium text-gray-600">Discount Start Date</label> {/* Changed label for clarity */}
                    <input type="date" name="discountStart" id="discountStart" value={productData.discountStart || ''} onChange={handleChange} className="mt-1 block w-full text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="discountEnd" className="block text-xs font-medium text-gray-600">Discount End Date</label> {/* Changed label for clarity */}
                    <input type="date" name="discountEnd" id="discountEnd" value={productData.discountEnd || ''} onChange={handleChange} className="mt-1 block w-full text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="discountPercentage" className="block text-xs font-medium text-gray-600">Discount Percentage (%)</label>
                    <input type="number" step="0.01" name="discountPercentage" id="discountPercentage" value={productData.discountPercentage || ''} onChange={handleChange} className="mt-1 block w-full text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
            </div>
        </fieldset>
        */}

        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={productData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Product is Active
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
