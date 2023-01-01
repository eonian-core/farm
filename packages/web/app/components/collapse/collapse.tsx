import styles from "./collapse.module.scss";

interface CollapseProp {
  index: number;
  label: string;
  description: string;
}

export default function Collapse({ index, label, description }: CollapseProp) {
  return (
    <div className={styles.container}>
      <div
        tabIndex={index}
        className="collapse-arrow rounded-box collapse border border-base-300 bg-base-100"
      >
        <div className="collapse-title text-xl font-medium">{label}</div>
        <div className="collapse-content">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
