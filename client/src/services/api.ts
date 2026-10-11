import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gc_token')
  if (token) config.headers.Authorization = Bearer 
  return config
})

export const executeCode    = (code: string, language: string) =>
  api.post('/execute', { code, language }).then((r) => r.data)

export const fetchRooms     = () => api.get('/rooms').then((r) => r.data)
export const createRoom     = (name: string, lang: string) =>
  api.post('/rooms', { name, language: lang }).then((r) => r.data)
export const joinRoom       = (roomId: string) =>
  api.post(/rooms//join).then((r) => r.data)

export default api