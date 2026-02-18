function RiskSummaryCards({ riskDistribution }) {
  const cards = [
    {
      level: 'high',
      count: riskDistribution?.high || 0,
      icon: '⚠️',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-500',
      barColor: 'bg-red-500',
      accentColor: 'from-red-500 to-red-600'
    },
    {
      level: 'medium',
      count: riskDistribution?.medium || 0,
      icon: '⚡',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-500',
      barColor: 'bg-yellow-500',
      accentColor: 'from-yellow-500 to-yellow-600'
    },
    {
      level: 'low',
      count: riskDistribution?.low || 0,
      icon: '✅',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-500',
      barColor: 'bg-green-500',
      accentColor: 'from-green-500 to-green-600'
    }
  ];

  const total = cards.reduce((sum, card) => sum + card.count, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {cards.map((card) => {
        const percentage = total > 0 ? Math.round((card.count / total) * 100) : 0;
        
        return (
          <div
            key={card.level}
            className={`${card.bgColor} rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-8 border-l-4 ${card.borderColor} shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            {/* Header with Icon */}
            <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5 md:mb-6">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  {card.level} Risk
                </p>
                <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${card.textColor}`}>
                  {card.count}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl opacity-80 flex-shrink-0">{card.icon}</div>
            </div>

            {/* Stats and Percentage */}
            <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5 md:mb-6">
              <p className="text-xs sm:text-sm text-gray-600">
                {percentage}% of students
              </p>
              <div className={`${card.textColor} text-lg sm:text-xl font-bold`}>
                {percentage}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 bg-opacity-50 rounded-full h-2 sm:h-3 overflow-hidden">
                <div
                  className={`h-full ${card.barColor} rounded-full transition-all duration-500 ease-out shadow-md`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">Total: {total} students</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RiskSummaryCards;
