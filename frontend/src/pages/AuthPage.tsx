import { registerUser } from "@/api/auth.api";
import { SubmitButton } from "@/components/SubmitButton";
import { FormField } from "@/form/FormField";
import { FormWrapper } from "@/form/FormWrapper";
import { useAuth } from "@/hooks/useAuth";
import {
    loginSchema,
    registerSchema,
    type LoginFormType,
    type RegisterFormType
} from "@/validators/auth.validators";
import { useNavigate, Link } from "react-router-dom";

interface AuthFormProps {
    isRegister?: boolean;
}

export function AuthForm({ isRegister = false }: AuthFormProps) {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (values: LoginFormType | RegisterFormType) => {
        try {
            if (isRegister) {
                await registerUser(values as RegisterFormType);
                navigate("/login");
            } else {
                await login(values as LoginFormType);
                navigate("/");
            }
        } catch (error) {
            console.log("error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="border border-border rounded-xl shadow-sm bg-card p-8 space-y-6">

                    <div className="space-y-1 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isRegister ? "Create an account" : "Welcome back"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isRegister
                                ? "Sign up to start creating and joining events"
                                : "Sign in to your account to continue"}
                        </p>
                    </div>

                    <FormWrapper
                        schema={isRegister ? registerSchema : loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {isRegister && (
                            <FormField<RegisterFormType> name="name" label="Full Name" type="text" />
                        )}
                        <FormField<LoginFormType> name="email" label="Email address" type="email" />
                        <FormField<LoginFormType> name="password" label="Password" type="password" />
                        <SubmitButton
                            text={isRegister ? "Create account" : "Sign in"}
                        />
                    </FormWrapper>
                    {!isRegister && (
                        <div className="w-full text-center">
                            <Link to="/verify-email" className="text-sm font-medium underline-offset-4 hover:underline text-foreground">
                                Verify your email
                            </Link>
                        </div>
                    )}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-card px-2 text-muted-foreground">
                                {isRegister ? "Already have an account?" : "Don't have an account?"}
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to={isRegister ? "/login" : "/register"}
                            className="text-sm font-medium underline-offset-4 hover:underline text-foreground"
                        >
                            {isRegister ? "Sign in instead" : "Create an account"}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}