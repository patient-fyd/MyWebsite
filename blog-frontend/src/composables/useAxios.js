import axios from 'axios';

export function useAxios() {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080', // 替换为你的 API 地址
        timeout: 5000,
    });

    return {
        axios: axiosInstance,
    };
}