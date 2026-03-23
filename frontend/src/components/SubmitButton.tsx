import type { FC } from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
    isLoading?: boolean;
    text: string;
}

export const SubmitButton: FC<SubmitButtonProps> = ({ isLoading, text }) => (
    <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Loading..." : text}
    </Button>
);