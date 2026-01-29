import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000/api' })

API.setToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = 'Bearer ' + token
  } else {
    delete API.defaults.headers.common['Authorization']
  }
}

API.getToken = () => localStorage.getItem('token')

// Auto-load token on module initialization
const token = localStorage.getItem('token')
if (token) {
  API.setToken(token)
}

export default API
