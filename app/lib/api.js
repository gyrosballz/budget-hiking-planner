const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
    this.token = null;
    this.role = 'user';
    this.username = null;

    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      this.role = localStorage.getItem('role') || 'user';
      const user = localStorage.getItem('user');
      if (user) {
        this.username = JSON.parse(user).username;
      }
    }
  }

  setToken(token, role = 'user', username = null) {
    this.token = token;
    this.role = role;
    this.username = username;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (username) {
      localStorage.setItem('user', JSON.stringify({ username }));
    }
  }

  clearToken() {
    this.token = null;
    this.role = 'user';
    this.username = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'x-user-role': this.role,
      ...options.headers,
    };

    if (this.username) {
      headers['x-user-name'] = this.username;
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 204) {
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Plans
  async getPlans() {
    return this.request('/plans');
  }

  async getPlan(id) {
    return this.request(`/plans/${id}`);
  }

  async createPlan(plan) {
    return this.request('/plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  }

  async updatePlan(id, plan) {
    return this.request(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    });
  }

  async deletePlan(id) {
    return this.request(`/plans/${id}`, { method: 'DELETE' });
  }

  // Products
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(product) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id, product) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(order) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateOrder(id, order) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteOrder(id) {
    return this.request(`/orders/${id}`, { method: 'DELETE' });
  }

  // Auth
  async login(username, password) {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.token, data.role, data.username);
    return data;
  }

  async register(username, password) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }
}

export const apiClient = new APIClient();
