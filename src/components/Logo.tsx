import React from "react";
interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-9",
    lg: "h-14",
    xl: "h-20",
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        viewBox="0 0 160 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSize} w-auto text-indigo dark:text-indigo-400 drop-shadow-sm`}
      >
        {/* Modernized Bus Outline inspired by user reference */}
        <path
          d="M10 24C10 19.5817 13.5817 16 18 16H134.5C141.956 16 148 22.0441 148 29.5V36C148 40.4183 144.418 44 140 44H20C15.5817 44 12 40.4183 12 36"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Front Window / Mirror detail */}
        <path
          d="M136 16L143 12C145 11 150 11 150 15V22"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The Text integrated into the bus body - styled to match reference */}
        <text
          x="12"
          y="38"
          fill="currentColor"
          className="font-heading font-black italic tracking-tighter"
          style={{ fontSize: "28px", fontStyle: "italic", letterSpacing: "-0.05em" }}
        >
          <tspan className="text-[32px] translate-y-1">P</tspan>AYANA
        </text>

        {/* Wheels with pulse effect container */}
        <circle cx="34" cy="46" r="6" fill="var(--background)" stroke="currentColor" strokeWidth="3" />
        <circle cx="118" cy="46" r="6" fill="var(--background)" stroke="currentColor" strokeWidth="3" />
        
        {/* Modern bus details */}
        <path d="M125 20H142V32H128" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M148 26V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      </svg>
    </div>
  );
}
