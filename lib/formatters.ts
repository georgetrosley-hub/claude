export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}M`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeLabel(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (Math.abs(diffHours) < 24) {
    if (diffHours === 0) return "Now";
    return diffHours > 0 ? `In ${diffHours}h` : `${Math.abs(diffHours)}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return diffDays > 0 ? `In ${diffDays}d` : `${Math.abs(diffDays)}d ago`;
}
