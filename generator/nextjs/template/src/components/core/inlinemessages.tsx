import * as React from "react";
import styles from "./inlinemessages.module.css";
import { NeutralIcon } from "./icons/NeutralIcon";
import { cn } from "../../lib/utils";
import { ErrorIcon } from "./icons/ErrorIcon";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: "info" | "success" | "warning" | "error" | "neutral";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, state = "info", children, ...props }, ref) => {
    const typeClassMap = {
      info: styles["info-style"],
      success: styles["success-style"],
      warning: styles["warning-style"],
      error: styles["error-style"],
      neutral: styles["neutral-style"],
    };
    const iconMap = {
      info: <NeutralIcon />,
      success: <NeutralIcon />,
      warning: <NeutralIcon />,
      error: <ErrorIcon />,
      neutral: <NeutralIcon />,
    };

    const titleChildren = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === AlertTitle
    );

    const descriptionChildren = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === AlertDescription
    );

    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        <div className={cn(styles["title-style"], typeClassMap[state])}>
          <div>{iconMap[state]}</div>
          <div>{titleChildren}</div>
        </div>
        {descriptionChildren && (
          <div
            className={cn(
              styles.description,
              styles[`${state}-style-description`]
            )}
          >
            <span>{descriptionChildren}</span>
          </div>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn(styles.message, className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.message, className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
