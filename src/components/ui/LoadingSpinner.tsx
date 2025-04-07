import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FC } from "react";

interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large";
    message?: string;
    fullScreen?: boolean;
    className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
    size = "medium",
    message = "Carregando...",
    fullScreen = false,
    className = "",
}) => {
    // Size mappings
    const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-12 h-12",
        large: "w-16 h-16",
    };

    // Font size mappings
    const fontSizeClasses = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
    };

    const containerClasses = cn(
        "flex flex-col items-center justify-center",
        fullScreen ? "min-h-screen fixed inset-0 bg-gray-50/80 z-50" : "p-4",
        className
    );

    return (
        <div className={containerClasses} role="status" aria-live="polite">
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer spinning ring */}
                <motion.div
                    className="absolute inset-0 border-4 border-transparent border-t-[#09A08D] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />

                {/* Inner spinning ring (opposite direction) */}
                <motion.div
                    className="absolute inset-2 border-4 border-transparent border-t-[#3C787A] rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 1.5,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#49BC99] rounded-full" />
                </div>
            </div>

            {message && (
                <p className={`mt-4 text-[#3A3A3A] font-medium ${fontSizeClasses[size]}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
