function TrendPlaceholder({ title, data, type }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate max value for scaling
  const maxValue = data ? Math.max(...data) : 100;
  const minValue = data ? Math.min(...data) : 0;
  const avgValue = data ? Math.round(data.reduce((a, b) => a + b, 0) / data.length) : 0;

  return (
    <div className="space-y-6">
      {/* Chart Container */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-indigo-100 overflow-hidden">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">{title}</h3>
        
        {/* Stats Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Average</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-600">{avgValue}%</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Peak</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{maxValue}%</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Low</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-600">{minValue}%</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between h-48 sm:h-64 md:h-80 gap-1 sm:gap-2 md:gap-3 px-2 sm:px-4">
          {data && data.map((value, index) => {
            const height = ((value - minValue) / (maxValue - minValue)) * 100;
            const isWeekend = index >= 5;
            const isAboveAvg = value > avgValue;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 md:gap-3 group">
                {/* Value Label - appears on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs sm:text-sm font-semibold text-indigo-600 h-4 sm:h-5 md:h-6">
                  {value}%
                </div>

                {/* Bar */}
                <div className="w-full flex items-end justify-center h-48 sm:h-64 md:h-64 relative">
                  <div
                    className={`w-full rounded-t transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-y-110 origin-bottom cursor-pointer ${
                      isWeekend 
                        ? 'bg-gradient-to-t from-gray-400 to-gray-300' 
                        : isAboveAvg
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-500'
                        : 'bg-gradient-to-t from-blue-500 to-blue-400'
                    }`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${days[index]}: ${value}%`}
                  />
                </div>
                
                {/* Day Label */}
                <div className={`text-xs sm:text-sm font-semibold ${isWeekend ? 'text-gray-500' : 'text-gray-700'}`}>
                  {days[index]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-indigo-200 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded"></div>
            <span className="text-xs sm:text-sm text-gray-700 font-medium">Above Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-500 to-blue-400 rounded"></div>
            <span className="text-xs sm:text-sm text-gray-700 font-medium">Below Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-gray-400 to-gray-300 rounded"></div>
            <span className="text-xs sm:text-sm text-gray-700 font-medium">Weekend</span>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 rounded-lg sm:rounded-xl p-4 sm:p-5">
        <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
          <span className="font-semibold">📊 Chart Insight:</span> This visualization shows daily attendance trends over a week. 
          The bars highlight patterns and help identify consistent or inconsistent attendance days.
        </p>
      </div>
    </div>
  );
}

export default TrendPlaceholder;
