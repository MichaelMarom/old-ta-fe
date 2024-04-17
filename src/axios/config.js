import axios from "axios";
import { toast } from "react-toastify";


const getAccessToken = () => {
    const token = localStorage.getItem('access_token');
    return token
}

export const showErrorToast = (err) => {
    toast.error(err?.response?.data?.message || "Error Completing the request")
    return err;
}

export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('access_token');
        if (!config.headers['Authorization'])
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        if (config.url === '/auth/signup' || config.url === '/auth/login')
            delete config?.headers?.Authorization
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const fileUploadClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})

fileUploadClient.interceptors.request.use(
    config => {
        const accessToken = getAccessToken();
        if (!config.headers['Authorization'])
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

