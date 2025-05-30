"use client";

import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";
import { useRouter } from "next/navigation";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gradient: "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:brightness-110",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  path?: string;
}

const Button = ({ children, className, variant, size, path, onClick, ...props }: ButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (path) router.push(path);
  };

  return (
    <button
      className={cn(buttonVariants({ variant, size, className })) + " cursor-pointer"}
      onClick={onClick ? onClick : handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button, buttonVariants };