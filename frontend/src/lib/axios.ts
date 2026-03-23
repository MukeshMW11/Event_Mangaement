import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});


let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
}> = [];


const processQueue = (error: unknown) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) return Promise.reject(error);

        const isAuthEndpoint = originalRequest.url?.includes("/auth/");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })

                })
                    .then(() => axiosInstance(originalRequest))
                    .catch((error) => Promise.reject(error));
            };


            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosInstance.post("/auth/refresh-token");
                processQueue(null);
                return axiosInstance(originalRequest);
            }

            catch (err) {
                processQueue(err);
                toast.error("Session expired, login again !");
                window.location.href = "/login";
                return Promise.reject(err);
            }
            finally {
                isRefreshing = false;
            }
        }

        const message = error?.response?.data.message || "Something went wrong";
        console.log("interceptor error:", error?.response?.data);
        toast.error(message);
        return Promise.reject(error);
    }

);


export default axiosInstance;

