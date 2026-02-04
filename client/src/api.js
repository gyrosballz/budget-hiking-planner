import axios from 'axios'

// Creates axios instance configured with backend API base URL
const API = axios.create({ baseURL: 'http://localhost:5000/api' })

// Attaches JWT token to all API requests via Authorization header
API.setToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = 'Bearer ' + token
  } else {
    delete API.defaults.headers.common['Authorization']
  }
}

// Retrieves JWT token from localStorage
API.getToken = () => localStorage.getItem('token')

// Auto-loads token from storage when module initializes
const token = localStorage.getItem('token')
if (token) {
  API.setToken(token)
}

export default API
