import React from 'react';

// Lightweight reusable card wrapper using Tailwind only
// Usage: <Card className="...">...</Card>
export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200 ${
        className || ''
      }`}
      {...props}
    >
      {children}
    </div>
  );
}
