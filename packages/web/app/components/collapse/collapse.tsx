import { Inter } from "@next/font/google";

export default function Collapse({ index, label, description }: { index: number, label: string, description: string }) {
  return (
    <div tabIndex={index} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
      <div className="collapse-title text-xl font-medium">
        {label}
      </div>
      <div className="collapse-content">
        <p>{description}</p>
      </div>
    </div>
  );
}