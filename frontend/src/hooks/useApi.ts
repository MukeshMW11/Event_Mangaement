import { useCallback, useState } from "react"
import type { apiRequest, ApiState } from "../interfaces/hookInterfaces";
import axiosInstance from "../lib/axios";

const useQuery = <T = unknown>() => {
    const [state, setState] = useState<ApiState<T>>({ loading: false });


    const request = useCallback(async (config: apiRequest) => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const res = await axiosInstance({
                method: config.method,
                url: config.url,
                data: config.data,
                params: config.params
            });
            setState({ loading: false, data: res?.data });
        } catch (error) {
            setState({ error: error, loading: false });
            throw error;
        }
    }, []);
    return { ...state, request };
};


export default useQuery;