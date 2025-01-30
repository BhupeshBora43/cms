import axios from "axios";
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../store/Slices/auth.slice";
const axiosInstance = axios.create()

axiosInstance.defaults.baseURL = "http://localhost:5000";

axiosInstance.defaults.withCredentials = true;

let isRetrying = false;

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !isRetrying
        ) {
            isRetrying = true;
            try {
                const { data } = await axiosInstance.post(
                    '/user/refreshToken'
                );

                isRetrying = false;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.log("Failed to refresh token:", err.message);
                isRetrying = false;

                const setLogin = new Event('setLogin');
                window.dispatchEvent(setLogin);
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;