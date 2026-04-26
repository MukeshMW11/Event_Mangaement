import { useState, useEffect, useCallback, useRef } from "react"
import { FormWrapper } from "./FormWrapper"
import { FormField } from "./FormField"
import { Button } from "@/components/ui/button"
import { emailVerificationSchema } from "@/validators/email.validators"
import toast from "react-hot-toast"
import { verifyEmail } from "@/api/email.api"

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmail = () => {
    const [cooldown, setCooldown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sentTo, setSentTo] = useState<string | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const cooldownRef = useRef(0);
    const isLoadingRef = useRef(false);

    useEffect(() => { cooldownRef.current = cooldown }, [cooldown]);
    useEffect(() => { isLoadingRef.current = isLoading }, [isLoading]);

    useEffect(() => {
        const savedExpiry = localStorage.getItem("verifyEmailCooldownExpiry")
        if (savedExpiry) {
            const remaining = Math.ceil((Number(savedExpiry) - Date.now()) / 1000)
            if (remaining > 0) setCooldown(remaining)
        }
        return () => clearInterval(intervalRef.current!)
    }, []);

    useEffect(() => {
        if (cooldown <= 0) {
            clearInterval(intervalRef.current!)
            return
        }
        intervalRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!)
                    localStorage.removeItem("verifyEmailCooldownExpiry")
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(intervalRef.current!)
    }, [cooldown]);

    const startCooldown = useCallback(() => {
        const expiry = Date.now() + RESEND_COOLDOWN_SECONDS * 1000
        localStorage.setItem("verifyEmailCooldownExpiry", String(expiry))
        setCooldown(RESEND_COOLDOWN_SECONDS)
    }, []);

    const handleEmailLink = useCallback(async (values: { email: string }): Promise<void> => {
        if (cooldownRef.current > 0 || isLoadingRef.current) return

        setIsLoading(true)
        try {
            const response = await verifyEmail(values.email);
            console.log("THe repsonse from axios instance is", response);

            setSentTo(values.email);
            startCooldown();
            toast.success("Verification email sent! Please check your inbox.")
        } catch (error) {
            if (error?.status === 429) toast.error("Too many requests. Please try again later.")
        } finally {
            setIsLoading(false);
        }
    }, [startCooldown]);

    const isDisabled = cooldown > 0 || isLoading;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-1">Verify your email</h2>
            <p className="text-sm text-gray-500 mb-6">
                {sentTo
                    ? `We sent a link to ${sentTo}. Didn't get it?`
                    : "Enter your email to receive a verification link."}
            </p>

            <FormWrapper schema={emailVerificationSchema} onSubmit={handleEmailLink}>
                <FormField name="email" label="Email address" type="email" />

                <div className="flex items-center gap-3 mt-2">
                    <Button type="submit" disabled={isDisabled}>
                        {isLoading
                            ? "Sending…"
                            : sentTo
                                ? "Resend Link"
                                : "Send Link"}
                    </Button>

                    {cooldown > 0 && (
                        <p className="text-sm text-gray-400 tabular-nums">
                            Resend in{" "}
                            <span className="font-medium text-gray-600">
                                {cooldown}s
                            </span>
                        </p>
                    )}
                </div>
            </FormWrapper>
        </div>
    )
}

export default VerifyEmail;