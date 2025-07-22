import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Token expired
    if (
      error.response?.status === 401 &&
      error.response.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken,
        })
        const newAccess = response.data.access
        localStorage.setItem('accessToken', newAccess)
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError)
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
