import API from '../api'

// Fetches all hiking routes from the backend API
export async function fetchRoutes() {
  const res = await API.get('/routes');
  return res.data;
}
