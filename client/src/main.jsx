
import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import API from './api'

const t = localStorage.getItem('token')
if(t) API.setToken(t)

createRoot(document.getElementById('root')).render(<App/>)
