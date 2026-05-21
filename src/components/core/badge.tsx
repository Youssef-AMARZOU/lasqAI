import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          {
            "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200":
              variant === "default",
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200":
              variant === "success",
            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200":
              variant === "warning",
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200":
              variant === "error",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, type BadgeProps };
