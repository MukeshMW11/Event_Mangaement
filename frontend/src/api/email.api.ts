import axiosInstance from "@/lib/axios";

export const verifyEmail = async (email: string) => {
    const response = await axiosInstance.post("/verification/send-verification-email", {
        email
    });


    return response;
};
