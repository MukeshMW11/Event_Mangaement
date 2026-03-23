import type { AuthFormType } from "@/validators/auth.validators";

export interface User{
    id:string;
    email?:string;
}

export interface authContextType {
    user: User | null,
    isAuthenticated: boolean,
    isLoading:boolean,
    login:(data:AuthFormType)=>Promise<void>,
    logout:()=>Promise<void>;
}

 
