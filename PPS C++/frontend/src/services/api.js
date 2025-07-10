import axios from 'axios';

// URL absoluta de tu backend + prefijo /api
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Inyectar token en cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si recibimos 401, limpiamos y redirigimos al login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Endpoints de Autenticación
export const auth = {
  register: data => api.post('/register', data),
  login:    data => api.post('/login', data),
  me:       ()   => api.get('/me'),
};

// Endpoints de Maratones
export const marathons = {
  getAll:          ()                        => api.get('/marathons'),
  getById:         id                        => api.get(`/marathons/${id}`),
  create:          data                      => api.post('/marathons', data),
  delete:          id                        => api.delete(`/marathons/${id}`),
  addProblem:      (mid, pid)                => api.post(`/marathons/${mid}/problems`, { problem_id: pid }),
  removeProblem:   (mid, pid)                => api.delete(`/marathons/${mid}/problems/${pid}`),
  register:        id                        => api.post(`/marathons/${id}/register`),
  registerStudent: id                        => api.post(`/marathons/${id}/register`), // Mantener por compatibilidad
  getMyMarathons:  ()                        => api.get('/my-marathons'),
  getStudents:     id                        => api.get(`/marathons/${id}/students`),
  removeStudent:   (mid, uid)                => api.delete(`/marathons/${mid}/students/${uid}`),
};

// Endpoints de Problemas
export const problems = {
  getAll:  ()  => api.get('/problems'),
  getById: id => api.get(`/problems/${id}`),
  create:  d  => api.post('/problems', d),
  delete:  id => api.delete(`/problems/${id}`),
};

// Endpoints de Usuarios
export const users = {
  getAll:       ()           => api.get('/users'),
  updateProfile: data        => api.put('/profile', data),
  updateUser:   (id, data)   => api.put(`/users/${id}`, data),
  deleteUser:   id           => api.delete(`/users/${id}`),
};

// Health check
export const health = {
  check: () => api.get('/health'),
};

export default api;