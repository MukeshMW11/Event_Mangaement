import { createContext } from "react";
import type { authContextType } from "../interfaces/AuthInterfaces";
export const AuthContext = createContext<authContextType | null>(null);




