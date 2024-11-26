import React from "react";
import "./Row.css";

interface RowProps {
  children: React.ReactNode;
  sticky?: boolean;
  className?: string;
  id?: string;
}

export default function Row({
  children,
  sticky = false,
  className = "",
  id = "",
}: RowProps) {
  const childrenArray = React.Children.toArray(children);
  const baseClass = childrenArray.length === 3 ? "row-three" : "row-single";
  const stickyClass = sticky ? "sticky" : "";
  const rowClass = `row ${baseClass} ${stickyClass} ${className}`.trim();

  return (
    <div className={rowClass} id={id}>
      {children}
    </div>
  );
}
