/**
 * API Client for Budget Hiking Planner
 * Handles all API requests with error handling and auth
 */

const API_BASE = 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
    this.token = localStorage.getItem('token');
    this.role = localStorage.getItem('role') || 'user';
  }

  setToken(token, role = 'user') {
    this.token = token;
    this.role = role;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  clearToken() {
    this.token = null;
    this.role = 'user';
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'x-user-role': this.role,
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.error || data.message || 'API Error');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }
      throw error;
    }
  }

  // Auth
  register(username, password) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  login(username, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Plans
  getPlans() {
    return this.request('/plans');
  }

  getPlan(id) {
    return this.request(`/plans/${id}`);
  }

  createPlan(planData) {
    return this.request('/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  updatePlan(id, planData) {
    return this.request(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  }

  deletePlan(id) {
    return this.request(`/plans/${id}`, {
      method: 'DELETE',
    });
  }

  // Products
  getProducts() {
    return this.request('/products');
  }

  getProduct(id) {
    return this.request(`/products/${id}`);
  }

  createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  reduceStock(id, quantity) {
    return this.request(`/products/${id}/reduce-stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  getOrders() {
    return this.request('/orders');
  }

  getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  updateOrder(id, orderData) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  deleteOrder(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  health() {
    return this.request('/ping');
  }
}

export default new APIClient();
