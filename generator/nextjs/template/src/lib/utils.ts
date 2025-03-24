import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine Tailwind classes conditionally & safely.
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
