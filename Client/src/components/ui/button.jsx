import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion"; // 👈 motion added
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default: "bg-[var(--btn)] text-white hover:bg-[var(--btn-hover)]",
        secondary:
          "bg-[var(--bg-ter)] hover:bg-[var(--bg-primary)] text-[var(--txt)]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        transparent: "text-[var(--txt)]",
        link: "text-[var(--txt)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "px-5 py-2 rounded-lg transition-colors duration-300 ease-in-out",
        sm: "h-9 px-4 py-2 text-sm rounded-md",
        lg: "py-2.5 px-5 rounded-lg",
        icon: "p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button;

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.022 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
