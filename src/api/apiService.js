import axiosInstance from "./axiosInstance";

// Auth APIs
export const authAPI = {
  login: (credentials) => axiosInstance.post("/auth/admin/login", credentials),
  logout: () => axiosInstance.post("/auth/admin/logout"),
  getProfile: () => axiosInstance.get("/auth/admin/profile"),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => axiosInstance.get("/admin/dashboard/stats"),
  getChartData: () => axiosInstance.get("/admin/dashboard/analytics"),
  getRecentOrders: () => axiosInstance.get("/admin/orders/recent"),
};

// Orders APIs
export const orderAPI = {
  getAll: (params) => axiosInstance.get("/admin/orders", { params }),
  getNew: () => axiosInstance.get("/admin/orders/new"),
  getCompleted: () => axiosInstance.get("/admin/orders/completed"),
  getCancelled: () => axiosInstance.get("/admin/orders/cancelled"),
  getById: (id) => axiosInstance.get(`/admin/orders/${id}`),
  create: (data) => axiosInstance.post("/admin/orders", data),
  update: (id, data) => axiosInstance.put(`/admin/orders/${id}`, data),
  updateStatus: (id, status) =>
    axiosInstance.patch(`/admin/orders/${id}/status`, { status }),
  delete: (id) => axiosInstance.delete(`/admin/orders/${id}`),
};

// Products APIs
export const productAPI = {
  getAll: (params) => axiosInstance.get("/admin/products", { params }),
  getById: (id) => axiosInstance.get(`/admin/products/${id}`),
  create: (data) => axiosInstance.post("/admin/products", data),
  update: (id, data) => axiosInstance.put(`/admin/products/${id}`, data),
  updateStatus: (id, status) =>
    axiosInstance.patch(`/admin/products/${id}/status`, { status }),
  delete: (id) => axiosInstance.delete(`/admin/products/${id}`),
  // Categories
  getCategories: () => axiosInstance.get("/admin/categories"),
  createCategory: (data) => axiosInstance.post("/admin/categories", data),
  updateCategory: (id, data) =>
    axiosInstance.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/admin/categories/${id}`),
  // Reviews
  getReviews: (params) => axiosInstance.get("/admin/reviews", { params }),
  updateReviewStatus: (id, status) =>
    axiosInstance.patch(`/admin/reviews/${id}/status`, { status }),
  deleteReview: (id) => axiosInstance.delete(`/admin/reviews/${id}`),
};

// Customers APIs
export const customerAPI = {
  getAll: (params) => axiosInstance.get("/customers", { params }),
  getById: (id) => axiosInstance.get(`/customers/${id}`),
  create: (data) => axiosInstance.post("/customers", data),
  update: (id, data) => axiosInstance.put(`/customers/${id}`, data),
  delete: (id) => axiosInstance.delete(`/customers/${id}`),
};

// Staff APIs
export const staffAPI = {
  getAll: (params) => axiosInstance.get("/admin/staff", { params }),
  getById: (id) => axiosInstance.get(`/admin/staff/${id}`),
  create: (data) => axiosInstance.post("/admin/staff", data),
  update: (id, data) => axiosInstance.put(`/admin/staff/${id}`, data),
  updateStatus: (id, status) =>
    axiosInstance.patch(`/admin/staff/${id}/status`, { status }),
  delete: (id) => axiosInstance.delete(`/admin/staff/${id}`),
};

// Media APIs
export const mediaAPI = {
  getAll: (params) => axiosInstance.get("/media", { params }),
  upload: (formData) =>
    axiosInstance.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => axiosInstance.delete(`/media/${id}`),
};

// Other APIs can be added following the same pattern
