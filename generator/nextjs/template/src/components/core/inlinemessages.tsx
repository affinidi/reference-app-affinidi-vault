import * as React from "react";
import "./inlinemessages.css";
import { NeutralIcon } from "./icons/NeutralIcon";
// import { InfoIcon } from './icons/InfoIcon'
// import { ErrorIcon } from './icons/ErrorIcon'
// import { SuccessIcon } from './icons/SuccessIcon'
// import { WarningIcon } from './icons/WarningIcon'
import { cn } from "../../lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: "info" | "success" | "warning" | "error" | "neutral";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, state = "info", children, ...props }, ref) => {
    const typeClassMap = {
      info: "info-style",
      success: "success-style",
      warning: "warning-style",
      error: "error-style",
      neutral: "neutral-style",
    };
    const iconMap = {
      info: <NeutralIcon />,
      success: <NeutralIcon />,
      warning: <NeutralIcon />,
      error: <NeutralIcon />,
      neutral: <NeutralIcon />,
    };

    const titleChildren = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === AlertTitle
    );

    const descriptionChildren = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === AlertDescription
    );

    return (
      <div ref={ref} className={cn("container", className)} {...props}>
        <div id="asdasd" className={cn("title-style", typeClassMap[state])}>
          <div>{iconMap[state]}</div>
          <div>{titleChildren}</div>
        </div>
        {descriptionChildren && (
          <div
            className={cn("description", `${typeClassMap[state]}-description`)}
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
  <h5 ref={ref} className={cn("message", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("message", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
