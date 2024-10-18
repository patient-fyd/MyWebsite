import axios from 'axios';

export function useAxios() {
    const axiosInstance = axios.create({
        baseURL: 'http://your-api-url.com', // 替换为你的 API 地址
        timeout: 5000,
    });

    return {
        axios: axiosInstance,
    };
}