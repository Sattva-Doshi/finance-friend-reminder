
import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  withHover?: boolean;
  withBorder?: boolean;
  withShadow?: boolean;
  variant?: "default" | "glass";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, withHover = true, withBorder = true, withShadow = true, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden",
          variant === "glass" && "backdrop-blur-md bg-white/80",
          variant === "default" && "bg-card",
          withBorder && "border",
          withShadow && "shadow-card",
          withHover && "transition-all hover:shadow-elevated hover:-translate-y-0.5",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 flex flex-col space-y-1", className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-6 pb-6", className)} {...props} />
    );
  }
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 pb-6 pt-0 flex items-center", className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
