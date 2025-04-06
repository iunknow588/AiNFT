// import React from "react";

interface StatsProps {
  value: string | number;
  label: string;
}

export function Stats({ value, label }: StatsProps) {
  return (
    <div className="stats">
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}
