import axios from "axios";

const axiosInstance = axios.create()

axiosInstance.defaults.baseURL="http://localhost:5000";

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;