
import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import API from './api'

// Restore authentication token from localStorage if available on app load
const t = localStorage.getItem('token')
if(t) API.setToken(t)

// Initialize React application and mount to DOM
createRoot(document.getElementById('root')).render(<App/>)
