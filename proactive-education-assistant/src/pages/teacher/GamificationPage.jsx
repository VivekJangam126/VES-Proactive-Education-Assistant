// export default function GamificationPage() {
//   return (
//     <div className="px-6 py-6 bg-slate-100 min-h-screen">
//       <div className="max-w-5xl mx-auto space-y-6">

//         <div>
//           <h1 className="text-2xl font-semibold text-slate-900">
//             Teacher Progress
//           </h1>
//           <p className="text-sm text-slate-600">
//             Your impact & achievements
//           </p>
//         </div>

//         {/* Level Card */}
//         <div className="bg-white border rounded-lg p-6">
//           <p className="text-sm text-slate-500">Current Level</p>
//           <h2 className="text-3xl font-bold text-blue-600 mt-1">
//             Level 3 – Student Champion
//           </h2>

//           <div className="mt-4">
//             <div className="h-2 bg-slate-200 rounded-full">
//               <div className="h-2 bg-blue-600 rounded-full w-2/3"></div>
//             </div>
//             <p className="text-xs text-slate-500 mt-1">
//               680 / 1000 XP to next level
//             </p>
//           </div>
//         </div>

//         {/* Achievements */}
//         <div className="bg-white border rounded-lg p-6">
//           <h3 className="font-semibold text-slate-900 mb-3">
//             Achievements
//           </h3>

//           <ul className="grid sm:grid-cols-2 gap-3 text-sm">
//             <li>🏅 First 10 Students Added</li>
//             <li>🔥 7 Day Login Streak</li>
//             <li>📊 100 Attendance Records</li>
//             <li>💙 Helped 5 High Risk Students</li>
//           </ul>
//         </div>

//         {/* Daily Actions */}
//         <div className="bg-white border rounded-lg p-6">
//           <h3 className="font-semibold text-slate-900 mb-3">
//             Today’s Bonus Tasks
//           </h3>

//           <ul className="space-y-2 text-sm">
//             <li>✅ Add attendance (+20 XP)</li>
//             <li>✅ Add academic score (+30 XP)</li>
//             <li>⬜ Add behaviour note (+20 XP)</li>
//           </ul>
//         </div>

//       </div>
//     </div>
//   );
// }






export default function GamificationPage() {
  // Level roadmap data
  const levels = [
    { level: 1, title: "Newcomer", xp: 0, color: "bg-slate-400" },
    { level: 2, title: "Helper", xp: 300, color: "bg-green-500" },
    { level: 3, title: "Student Champion", xp: 1000, color: "bg-blue-600" },
    { level: 4, title: "Mentor", xp: 2000, color: "bg-purple-600" },
    { level: 5, title: "Master Educator", xp: 4000, color: "bg-orange-500" },
  ];

  const currentLevel = 3;
  const currentXP = 680;
  const nextLevelXP = 1000;

  return (
    <div className="px-4 py-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">
            Teacher Progress
          </h1>
          <p className="text-slate-600 mt-1">
            Track your impact and unlock achievements
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">680</p>
                <p className="text-xs text-slate-500">Total XP</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">4</p>
                <p className="text-xs text-slate-500">Achievements</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">7</p>
                <p className="text-xs text-slate-500">Day Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">5</p>
                <p className="text-xs text-slate-500">Students Helped</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Current Level & Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            
           {/* Current Level Card */}

<div className="bg-slate-900 border-b border-slate-700 rounded-xl p-6 shadow-lg">
  <div className="flex items-start justify-between mb-4">
   <div>
  <p className="!text-white !opacity-100 text-sm font-medium">
    Current Level
  </p>

  <h2 className="!text-white !opacity-100 text-3xl font-bold mt-1">
    Level {currentLevel}
  </h2>

  <p className="!text-white !opacity-100 text-lg font-semibold mt-1">
    Student Champion
  </p>
</div>


    <div className="bg-white/15 rounded-full px-4 py-2">
      <span className="text-2xl">🏅</span>
    </div>
  </div>

  <div className="mt-6">
    <div className="flex justify-between text-sm mb-2">
      <span className="text-white font-medium">
        Progress to Level 4
      </span>
      <span className="text-white font-semibold">
        {currentXP} / {nextLevelXP} XP
      </span>
    </div>

    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-white rounded-full transition-all duration-500"
        style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
      />
    </div>

    <p className="text-xs text-white opacity-70 mt-2">
      {nextLevelXP - currentXP} XP remaining
    </p>
  </div>
</div>

            {/* Level Roadmap */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span>🗺️</span> Level Roadmap
              </h3>
              
              <div className="space-y-4">
                {levels.map((lvl, index) => (
                  <div key={lvl.level} className="relative">
                    <div className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                      lvl.level === currentLevel 
                        ? 'bg-blue-50 border-2 border-blue-500' 
                        : lvl.level < currentLevel 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-slate-50 border border-slate-200'
                    }`}>
                      
                      {/* Level Icon */}
                      <div className={`${lvl.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                        lvl.level > currentLevel ? 'opacity-40' : ''
                      }`}>
                        {lvl.level < currentLevel ? '✓' : lvl.level}
                      </div>

                      {/* Level Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">
                            {lvl.title}
                          </h4>
                          {lvl.level === currentLevel && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                              Current
                            </span>
                          )}
                          {lvl.level < currentLevel && (
                            <span className="text-green-600 text-xs">✓ Unlocked</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {lvl.level === levels.length 
                            ? `${lvl.xp}+ XP` 
                            : `${lvl.xp} - ${levels[index + 1]?.xp || '∞'} XP`}
                        </p>
                      </div>

                      {/* Lock Icon for Future Levels */}
                      {lvl.level > currentLevel && (
                        <div className="text-slate-300 text-xl">🔒</div>
                      )}
                    </div>

                    {/* Connecting Line */}
                    {index < levels.length - 1 && (
                      <div className={`absolute left-6 top-full h-4 w-0.5 ${
                        lvl.level < currentLevel ? 'bg-green-400' : 'bg-slate-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span>🏆</span> Achievements Unlocked
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">🏅</div>
                  <h4 className="font-semibold text-slate-900 text-sm">First 10 Students</h4>
                  <p className="text-xs text-slate-600 mt-1">Added your first batch of students</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">🔥</div>
                  <h4 className="font-semibold text-slate-900 text-sm">7 Day Streak</h4>
                  <p className="text-xs text-slate-600 mt-1">Logged in for 7 consecutive days</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-semibold text-slate-900 text-sm">100 Records</h4>
                  <p className="text-xs text-slate-600 mt-1">Tracked 100 attendance records</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">💙</div>
                  <h4 className="font-semibold text-slate-900 text-sm">Student Supporter</h4>
                  <p className="text-xs text-slate-600 mt-1">Helped 5 high-risk students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Daily Tasks */}
          <div className="space-y-6">
            
            {/* Today's Bonus Tasks */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span>📋</span> Today's Bonus Tasks
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-600 text-xl mt-0.5">✓</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Add attendance</p>
                    <p className="text-xs text-green-600 font-medium mt-1">+20 XP earned</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-600 text-xl mt-0.5">✓</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Add academic score</p>
                    <p className="text-xs text-green-600 font-medium mt-1">+30 XP earned</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="text-slate-400 text-xl mt-0.5">◻️</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Add behaviour note</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Earn +20 XP</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Daily progress</span>
                  <span className="text-xs font-semibold text-slate-900">2 / 3 completed</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full mt-2">
                  <div className="h-full bg-blue-500 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <h3 className="font-semibold text-slate-900 mb-4">🎯 This Week</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">XP Earned</span>
                  <span className="text-lg font-bold text-purple-700">180</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">Tasks Completed</span>
                  <span className="text-lg font-bold text-purple-700">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">Students Updated</span>
                  <span className="text-lg font-bold text-purple-700">8</span>
                </div>
              </div>
            </div>

            {/* Next Achievement */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <h3 className="font-semibold text-slate-900 mb-3">🎁 Next Unlock</h3>
              <div className="text-center py-4">
                <div className="text-4xl mb-2 opacity-40">🌟</div>
                <p className="font-semibold text-slate-900">30 Day Streak</p>
                <p className="text-xs text-slate-600 mt-1">23 days to go</p>
                <div className="h-1.5 bg-amber-200 rounded-full mt-3">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}