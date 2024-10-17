import axios from 'axios'

const service = axios.create({
    baseURL: 'http://localhost:8080', // 后端服务地址
    timeout: 5000,
})

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service