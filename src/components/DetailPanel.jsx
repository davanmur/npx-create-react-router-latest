import React from "react";
import styles from "./DetailPanel.module.css";

export function DetailPanel({ node, onClose, onSelectChild, nodes }) {
  if (!node) return null;

  return (
    <div className={`${styles.panel} ${node ? styles.open : ""}`}>
      <button className={styles.close} onClick={onClose}>×</button>
      <h3 className={styles.name}>{node.name}</h3>
      <div className={styles.rank}>{node.rank}</div>
      <p className={styles.desc}>{node.desc}</p>
      {node.children?.length > 0 && (
        <div>
          <div className={styles.sectionLabel}>Contains</div>
          <ul className={styles.childList}>
            {node.children.map((child) => (
              <li
                key={child.id}
                className={styles.childItem}
                onClick={() => onSelectChild(child)}
              >
                {child.name}
                <span className={styles.childRank}>{child.rank}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
