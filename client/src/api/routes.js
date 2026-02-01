import API from '../api'

export async function fetchRoutes() {
  const res = await API.get('/routes');
  return res.data;
}
