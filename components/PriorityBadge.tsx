import React from "react";

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const styles = {
    High: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    Medium: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-500",
    },
    Low: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  }[priority] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-500",
  };

  return (
    <div
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${styles.dot}`}></span>
      {priority}
    </div>
  );
};

export default PriorityBadge;
