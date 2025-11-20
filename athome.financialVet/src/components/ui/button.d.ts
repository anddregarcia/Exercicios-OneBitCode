import * as React from "react";
import { type VariantProps } from "class-variance-authority@0.7.1";
declare const buttonVariants: any;
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export { Button, buttonVariants };
//# sourceMappingURL=button.d.ts.map