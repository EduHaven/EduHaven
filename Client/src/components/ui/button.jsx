import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion"; // 👈 motion added
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

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