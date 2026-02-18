function RiskBadge({ level }) {
  const getBadgeStyles = () => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          dot: 'bg-red-500',
          label: 'High Risk'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          dot: 'bg-yellow-500',
          label: 'Medium'
        };
      case 'low':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          dot: 'bg-green-500',
          label: 'Safe'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          dot: 'bg-gray-500',
          label: 'Unknown'
        };
    }
  };

  const styles = getBadgeStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${styles.bg} ${styles.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
      {styles.label}
    </span>
  );
}

export default RiskBadge;
