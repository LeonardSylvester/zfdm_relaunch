import DynamicIcon from "@/helpers/DynamicIcon";
import React from "react";

const Button = ({
  label,
  link,
  type,
  style = "primary",
  rel,
  className = "",
  icon,
}: {
  label: string;
  link: string;
  type?: string;
  style?:
  | "primary"
  | "secondary"
  | "transparent"
  | "light"
  | "outline"
  | "ghost";
  rel?: string;
  className?: string;
  icon?: any;
}) => {
  // Determine base button style
  const getButtonStyle = () => {
    switch (style) {
      case "secondary":
        return "btn-secondary";
      case "transparent":
        return "btn-transparent";
      case "light":
        return "btn-light";
      case "outline":
        return "btn-secondary";
      case "ghost":
        return "btn-ghost";
      default:
        return "btn-primary";
    }
  };

  return (
    <a
      href={link}
      target={link.startsWith("http") ? "_blank" : "_self"}
      rel={`noopener noreferrer ${rel ? (rel === "follow" ? "" : rel) : "nofollow"
        }`}
      className={`${type ? type : "btn"} ${getButtonStyle()} inline-flex items-center justify-center ${icon && "gap-2"} ${className}`}
    >
      {label}
      {icon && <DynamicIcon icon={icon} className="w-4 h-4" />}
    </a>
  );
};

export default Button;
