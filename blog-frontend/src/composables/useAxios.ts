import axios, { AxiosInstance } from 'axios';

export function useAxios(): { axios: AxiosInstance } {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080',
        timeout: 5000,
    });

    return {
        axios: axiosInstance,
    };
}